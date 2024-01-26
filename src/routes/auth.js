const express = require("express");
const router = express.Router();
const AuthModel = require("../models/auth");
const UserDataModel = require("../models/userData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/auth/validation", (req, res) => {
    // Obtem o token enviado pelo front-end
    const authorization = req.headers["authorization"];
    if (!authorization) {
        return res.json({ msg: "Acesso negado", ok: false });
    }
    const token = authorization.split(" ")[1];
    // Caso não tenha token
    if (!token) {
        return res.json({ msg: "Acesso negado", ok: false });
    }
    // Tentativa de dar acesso ao usuário
    try {
        const SECRET = process.env.SECRET;
        jwt.verify(token, SECRET);
        res.json({ msg: "Logado!", ok: true });
    } catch (error) {
        res.json({ msg: "token inválido", ok: false });
    }
});

router.post("/auth/register", async (req, res) => {
    const { username, password } = req.body;
    // Verifica se essas variáveis foram definidas
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(500)
            .json({ msg: "O username ou password não foi definido", ok: false });
    }
    // Verificação das informações recebidas
    const usernameStatus = usernameValidation(username);
    if (!usernameStatus.ok) {
        return res.status(422).json({ ...usernameStatus });
    }
    const passwordStatus = passwordValidation(password);
    if (!passwordStatus.ok) {
        return res.status(422).json({ ...passwordStatus });
    }

    // Verificação de nome único
    const user = await AuthModel.findOne({ username: username }, "-password");
    if (user) {
        return res.status(422).json({ msg: "Já tem outra pessoa com esse nome!", ok: false });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(12);
    const passwarodHash = await bcrypt.hash(password, salt);

    try {
        // Cria o registro
        const newUser = await AuthModel.create({ username: username, password: passwarodHash });
        // Cria um espaço no db para usar a todo list
        await UserDataModel.create({ user_id: newUser._id });
        res.status(201).json({ msg: "Conta criada com sucesso", ok: true });
    } catch (error) {
        console.error(`Erro ao tentar criar um novo registro: ${error}`);
        res.status(500)
            .json({ msg: "Houve um erro ao tentar criar seu registro, tente novamente mais tarde!", ok: false });
    }
});

router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    // Verifica se essas variáveis foram definidas
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(500)
            .json({ msg: "O username ou password não foi definido", ok: false });
    }
    // Verifica se o nome de usuário existe
    const user = await AuthModel.findOne({ username: username });
    if (!user) {
        return res.status(422).json({ msg: "Esse nome de usuário não existe", ok: false });
    }

    // Verifica se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha ou nome de usuário inválido!", ok: false });
    }

    // Criação do token
    try {
        const SECRET = process.env.SECRET;
        const token = jwt.sign({ userId: user._id, }, SECRET);
        return res.status(200)
            .json({ msg: "Login realizado com sucesso", ok: true, token: token });

    } catch (error) {
        console.log(`Erro ao tentar criar um token: ${error}`);
        return res.status(500)
            .json({ msg: "Houve um erro no servidor, tente novamente mais tarde!", ok: false });
    }
});

function usernameValidation(username) {
    const minDigits = 5;
    const maxDigits = 20;
    if (username.length < minDigits)
        return { ok: false, msg: `O nome de usuário precisa ter pelo menos ${minDigits} caracteres` };
    if (username.length > maxDigits)
        return { ok: false, msg: `O nome de usuário pode ter no máximo ${maxDigits} caracteres` };
    if (/[ ]/.test(username))
        return { ok: false, msg: "O nome de usuário não pode conter espaços" };

    return { ok: true };
}

function passwordValidation(password) {
    const minDigits = 8;
    const maxDigits = 20;
    if (password.length < minDigits)
        return { ok: false, msg: `A senha precisa de no mínimo ${minDigits} caracteres` };
    if (password.length > maxDigits)
        return { ok: false, msg: `A senha não pode passar de ${maxDigits} caracteres` };
    if (/[ ]/.test(password))
        return { ok: false, msg: "A senha não pode conter espaços" };

    return { ok: true };
}

module.exports = router;