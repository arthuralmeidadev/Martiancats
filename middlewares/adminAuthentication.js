const tokenizer = require("../helpers/tokenizer");
const encrypter = require("../helpers/encrypter");

async function adminAuthenticationMiddleware(req, res, next) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401);
    };
    const decoded = await tokenizer.verifyAccessToken(accessToken);
    const decrypted = await encrypter.decrypt(decoded);
    res.locals.isOperator = decrypted.role === "operator";

    next();
};

module.exports = adminAuthenticationMiddleware;