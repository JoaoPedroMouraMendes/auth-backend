const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const AuthModel = mongoose.model("Auth", authSchema);
module.exports = AuthModel;