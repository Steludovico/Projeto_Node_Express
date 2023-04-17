const express = require ('express');
const fs = require('fs');


const usuarios = express.Router() //usuários é a minha ROTA. //

usuarios.route('/')
.get((req, res) => {
    const { nome, media } = req.query;
    console.log(req.query);

    // Irá retornar o meu Banco de Ddaos. //
    const db = lerBancoDados();

    if (!nome && !media) {
        res.status(200).json(db);
    }  else if(nome) {
        const dbfiltrado = db.filter(aluno => aluno.nome.toLowerCase().includes(nome.toLowerCase()));
        if(dbfiltrado.length === 0){
            res.status(404).json({ mensagem: "aluno não encontrado" });
            return;
        } else{
            res.status(200).json(dbfiltrado);
        }

    } else if (media) {
        const dbfiltrado = db.filter(aluno => Number(aluno.media) >= Number(media));
        if(dbfiltrado.length === 0){
            res.status(404).json({ mensagem: "não encontrado com o parâmetro informado." });
            return;
        } else{
            res.status(200).json(dbfiltrado);
        }
    }

})

.post((req, res)=>{
    
    const {matricula, nome, media} = req.body;

    if(!matricula || !nome || !media){
        res.status(400).json({ mensagem: "Dados inválidos" });
        return;
    }

    // Vai definir um novo aluno, com base nos dados que enviamos na REQUISIÇÃO. //
    const novoAluno = {
        matricula,
        nome,
        media
    };

    // Vai retornar o meu Banco de Ddaos. //
    const db = lerBancoDados();

    // Vai verificar se o aluno que informamos, existe no Banco de Dados. //
    const alunoEncontrado = db.find(aluno => aluno.matricula === matricula);

    // Se o o aluno existe, ele vai retornar o erro e encerrar a REQUISIÇÃO. //
    if(alunoEncontrado){
        res.status(400).json({mensagem: "aluno já está cadastrado"});
        return;
    }

    // Vai adicionar o novo aluno no array, retornando o Banco de Dados. //
    db.push(novoAluno);

    // Grava o array modificado, no Banco de Dados. //
    gravarBancoDados(db);

    // Vai retornar o status 201, com a mensagem de sucesso! //
    res.status(201).json({ mensagem: "aluno criado com sucesso!" });


})

.put((req, res)=>{
    const { matricula, nome, media } = req.body;

        // Caso um dos campos obrigatórios não esteja na REQUISIÇÃO, retorna erro. //
        if (!matricula || !nome || !media) {
            res.status(404).json({ mensagem: "Dados obrigatórios não informados" });
            return;
        }

        // Vai retornar o meu Banco de Dados. //
        const db = lerBancoDados();

        // Vai verificar se o aluno existe no array, retornado do Bando de Dados. //
        const alunoEncontrado = db.find(aluno => aluno.matricula === matricula);

        // Verifica se há resposta na pesquisa anterior. //
        if (!alunoEncontrado) {
            res.status(404).json({ mensagem: "Aluno não encontrado." });
            return;
        }

        // Gera um array sem aluno, que será modificado. //
        const dbModificado = db.filter(aluno => aluno.matricula !== matricula);

        // Gera um objeto aluno com os dados alterados. //
        const alunoModificado = {
            matricula,
            nome,
            media
        };

        // Adiciona o novo aluno no array, retornado do banco de dados. //
        dbModificado.push(alunoModificado);

        // Grava o array modificado no banco de dados fake. //
        gravarBancoDados(dbModificado);

        // Retorna o status 200 e uma mensagem de sucesso. //
})

.delete((req, res)=> {
    const { matricula } = req.body;

        // Verifica se o campo matricula foi informado na REQUISIÇÃO. //
        if (!matricula) { // Caso não tenha sido informado retorna um erro e encerra a REQUISIÇÃO. //
            res.status(400).json({ mensagem: "Dados inválidos" });
            return;
        }

        // Vai retornar o Bando de Dados. //
        const db = lerBancoDados();

        // Encontra a matricula do aluno. //
        const alunoEncontrado = db.find(aluno => aluno.matricula === matricula);

        // Averigua se há resposta na pesquisa anterior. //
        if (!alunoEncontrado) { // Caso não exista envia uma mensagem de erro e encerra a requisição. //
            res.status(404).json({ mensagem: "Aluno não encontrado." });
            return;
        }

/* 
filtra o array de usuarios que retornou do banco de dados 
vai retornar todos os alunos, exceto o aluno que queremos excluir
*/
        const dbfiltrado = db.filter(usuarios => usuarios.matricula !== matricula);

        // Grava a informação no arquivo de alunos, só que no banco fake. ///
        gravarBancoDados(dbfiltrado);

        // Retorna status 200 e mensagem de confirmação de exclusão.
        res.status(200).json({ mensagem: "deletado com sucesso!" });
});

function lerBancoDados() {
    const data = fs.readFileSync('./db/db.json');
    const db = JSON.parse(data.toString());
    return db;
}

function gravarBancoDados(usuariosDB){
fs.writeFileSync('./db/db.json', JSON.stringify(usuariosDB));
}

module.exports = usuarios;