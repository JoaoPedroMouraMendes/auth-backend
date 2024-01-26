const express = require("express");
const router = express.Router();
const UserDataModel = require("../models/userData");
const AuthModel = require("../models/auth.js")
const mongoose = require("mongoose");

//* Cria os dados do usuário
router.post(("/user-data/create/:userId"), async (req, res) => {
    try {
        // Verifica se existe um usuário existe na db de auth
        const userId = req.params.userId;
        const userAuth = await AuthModel.findById(userId).catch(error => console.log(error));
        if (!userAuth)
            return res.status(422).json({ msg: "Esse usuário não existe!", ok: false });

        // Verifica se o usuário já existe no db da todo-list
        const userData = await UserDataModel.findOne({ user_id: userId });
        if (userData)
            return res.status(422).json({ msg: "Esse usuário já está registrado!", ok: false });
        const newUserData = await UserDataModel.create({ user_id: userId });
        return res.status(201).json({ msg: "Usuário criado!", ok: true, newUserData: newUserData });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ msg: "Ocorreu um erro ao tentar criar um novo usuário", ok: false });
    }
});

module.exports = router;