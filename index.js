const express = require('express');
const usuarios = require('./routes/usuarios')
const app = express();

app.use(express.json()); // garante que a aplicação receba o arquivo
app.use('/usuarios', usuarios);
app.listen(3000);
