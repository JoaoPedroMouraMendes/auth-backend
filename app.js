const express = require("express");
const app = express();
require("dotenv").config();

const authRoute = require("./src/routes/auth");
const connectDB = require("./src/db/connect");

//* Conexão ao banco de dados
connectDB();

//* Configurações
const PORT = 3030;

app.use(express.json());

//* Rotas
app.use("/", authRoute);

//* Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor incializado em: localhost:${PORT}`);
});