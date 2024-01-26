const jwt = require("jsonwebtoken");

// Verifica se o token é valido
function validateToken(req) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization)
            return { msg: "Token inválido!", ok: false };
        const token = authorization.split(" ")[1];
        if (!token) {
            return { msg: "Token inválido!", ok: false };
        }
        const decode = jwt.verify(token, process.env.SECRET);
        return {
            decode: decode,
            msg: "Usuário valido",
            ok: true
        }
    } catch (error) {
        return { msg: "Usuário inválido!", ok: false };
    }
}

module.exports = {
    validateToken
}