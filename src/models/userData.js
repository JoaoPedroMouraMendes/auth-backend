const mongoose = require("mongoose");
const todoSchema = require("./todo.js");

const userDataSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    todos: [todoSchema]
});

const UserDataModel = mongoose.model("Todo-list", userDataSchema);
module.exports = UserDataModel;