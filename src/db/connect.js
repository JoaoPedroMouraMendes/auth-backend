const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster.nixyoms.mongodb.net/?retryWrites=true&w=majority`);

        console.log("Conexão com o banco de dados realizado com sucesso!");
    } catch (error) {
        console.error(`Erro ao tentar conectar ao banco de dados: ${error}`);
    }
}

module.exports = connectDB;