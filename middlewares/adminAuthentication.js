const tokenizer = require("../helpers/tokenizer");
const encrypter = require("../helpers/encrypter");

async function adminAuthenticationMiddleware(req, res, next) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401);
    };
    const decoded = await tokenizer.verifyAccessToken(accessToken);
    const payload = await encrypter.decrypt(decoded);
    res.locals.isOperator = payload.role === "operator";

    next();
};

module.exports = adminAuthenticationMiddleware;