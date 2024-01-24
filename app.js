const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const authRoute = require("./src/routes/auth");
const connectDB = require("./src/db/connect");

//* Conexão ao banco de dados
connectDB();

//* Configurações
const PORT = 3000;

app.use(express.json());
app.use(cors());

//* Rotas
app.use("/", authRoute);

//* Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor incializado em: http://localhost:${PORT}`);
});