const express = require("express");
const router = express.Router();
const UserDataModel = require("../models/userData.js");
const { validateToken } = require("../utils/validations.js");

//* Obtem todas as tarefas do usuário
router.get("/todos", async (req, res) => {
    try {
        // Verifica se o usuário é valido
        const validationStatus = validateToken(req);
        if (!validationStatus.ok)
            return res.status(422).json(validationStatus);

        const userId = validationStatus.decode.userId;
        const userData = await UserDataModel.findOne({ user_id: userId });
        if (userData)
            return res.status(200).json({ todos: userData.todos, ok: true });

        return res.status(404).json({ msg: "Usuário não encontrado", ok: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Ocorreu um erro no servidor!", ok: false });
    }
});

//* Criar uma nova tarefa
router.post("/todo/create", async (req, res) => {
    try {
        // Verifica se o usuário é valido
        const validationStatus = validateToken(req);
        if (!validationStatus.ok)
            return res.status(422).json(validationStatus);

        const userId = validationStatus.decode.userId;
        const userData = await UserDataModel.findOne({ user_id: userId });
        if (!userData) {
            return res.status(404).json({ msg: "Usuário não encontrado", ok: false });
        }

        // Cria a nova tarefa
        userData.todos.push({ todoName: "Digite sua tarefa...", checked: false });
        await UserDataModel.findByIdAndUpdate(userData._id, userData, { new: true });
        return res.status(201).json({ msg: "Tarefa criada com sucesso!", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(422).json({ msg: "Ocorreu um erro no servidor!", ok: false });
    }
});

//* Edita uma tarefa
router.put("/todo/edit/:todoId", async (req, res) => {
    try {
        // Verifica se o usuário é valido
        const validationStatus = validateToken(req);
        if (!validationStatus.ok)
            return res.status(422).json(validationStatus);

        const userId = validationStatus.decode.userId;
        const userData = await UserDataModel.findOne({ user_id: userId });
        if (!userData) {
            return res.status(404).json({ msg: "Usuário não encontrado", ok: false });
        }

        // Busca pelo id da tarefa
        const todoId = req.params.todoId;
        const todoIndex = userData.todos.findIndex(todo => todo._id == todoId);

        // Caso o não encontrar a tarefa retorna
        if (todoIndex === -1)
            return res.status(422).json({ msg: "Tarefa não encontrada", ok: false });

        // Edita a tarefa
        const { newName, checked } = req.body;
        userData.todos[todoIndex] = { todoName: newName, checked: checked };
        await UserDataModel.findByIdAndUpdate(userData._id, userData, { new: true });
        return res.status(200).json({ msg: "Tarefa editada", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(422)
            .json({ msg: "Ocorreu um ao tentar editar uma tarefa!", ok: false });
    }
});

//* Deleta uma tarefa
router.delete("/todo/delete/:todoId", async (req, res) => {
    try {
        // Verifica se o usuário é valido
        const validationStatus = validateToken(req);
        if (!validationStatus.ok)
            return res.status(422).json(validationStatus);

        const userId = validationStatus.decode.userId;
        const userData = await UserDataModel.findOne({ user_id: userId });
        if (!userData)
            return res.status(404).json({ msg: "Usuário não encontrado", ok: false });

        // Busca pelo id da tarefa
        const todoId = req.params.todoId;
        const todoIndex = userData.todos.findIndex(todo => todo._id == todoId);

        // Caso o não encontrar a tarefa retorna
        if (todoIndex === -1)
            return res.status(422).json({ msg: "Tarefa não encontrada", ok: false });
        userData.todos.splice(todoIndex, 1);
        await UserDataModel.findByIdAndUpdate(userData._id, userData, { new: true });
        return res.status(200).json({ msg: "Tarefa deletada", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(422)
            .json({ msg: "Ocorreu um ao tentar deletar uma tarefa!", ok: false });
    }
});

module.exports = router;