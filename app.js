const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const authRouter = require("./src/routes/auth");
const todoRouter = require("./src/routes/todo.js");
const userDataRouter = require("./src/routes/userData.js");
const connectDB = require("./src/db/connect");

//* Conexão ao banco de dados
connectDB();

//* Configurações
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//* Rotas
app.get("/", (req, res) => {
    return res.json("Servidor funcionando!");
});

app.use("/", authRouter);
app.use("/", todoRouter);
app.use("/", userDataRouter);

//* Inicialização do servidor
app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(`Servidor incializado em: http://localhost:${PORT}`);
});