const express = require("express");
const router = express.Router();
const authModel = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/auth", (req, res) => {
    // só por teste
    const { token } = req.body;
    if (!token) {
        return res.json({ msg: "Acesso negado" });
    }
    try {
        const SECRET = process.env.SECRET;
        jwt.verify(token, SECRET);
        res.json({ msg: "Logado!" });
    } catch (error) {
        res.json({ msg: "token inválido" });
    }

});

router.post("/auth/register", async (req, res) => {
    const { username, password } = req.body;

    // Verificação das informações recebidas
    const usernameStatus = usernameValidation(username);
    if (!usernameStatus.ok) {
        return res.status(422).json({ msg: usernameStatus.msg });
    }
    const passwordStatus = passwordValidation(password);
    if (!passwordStatus.ok) {
        return res.status(422).json({ msg: passwordStatus.msg });
    }

    // Verificação de nome único
    const user = await authModel.findOne({ username: username }, "-password");
    if (user) {
        return res.status(422).json({ msg: "Já tem outra pessoa com esse nome!" });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(12);
    const passwarodHash = await bcrypt.hash(password, salt);

    try {
        // Cria o registro
        await authModel.create({ username: username, password: passwarodHash });
        res.status(201).json({ msg: "Conta criada com sucesso" });
    } catch (error) {
        console.error(`Erro ao tentar criar um novo registro: ${error}`);
        res.status(500)
            .json({ msg: "Houve um erro ao tentar criar seu registro, tente novamente mais tarde!" });
    }
});

router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;

    // Verifica se o nome de usuário existe
    const user = await authModel.findOne({ username: username });
    if (!user) {
        return res.status(422).json({ msg: "Esse nome de usuário não existe" });
    }

    // Verifica se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida!" });
    }

    // Criação do token
    try {
        const SECRET = process.env.SECRET;
        const token = jwt.sign({ id: user._id, }, SECRET);
        return res.status(200).json({ msg: "Login realizado com sucesso", token });

    } catch (error) {
        console.log(`Erro ao tentar criar um token: ${error}`);
        return res.status(500).json({ msg: "Houve um erro no servidor, tente novamente mais tarde!" });
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