const tokenizer = require("../helpers/tokenizer");
const encrypter = require("../helpers/encrypter");
const errors = require("../config/errors.config");

async function adminAuthenticationMiddleware(req, res, next) {
    try {
        const { accessToken } = req.cookies;
        
        if (!accessToken)
            throw errors.Forbidden;

        await tokenizer.verifyAccessToken(accessToken);

        const decoded = await tokenizer.verifyAccessToken(accessToken);
        const payload = await encrypter.decrypt(decoded);
        res.locals.isOperator = payload.role === "operator";

        next();
    } catch (err) {
        return res.redirect("admin/refresh");
    };
    
};

module.exports = adminAuthenticationMiddleware;