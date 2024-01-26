const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    todoName: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        required: true,
    }
});

module.exports = todoSchema;