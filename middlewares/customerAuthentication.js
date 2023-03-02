const tokenizer = require("../helpers/tokenizer");
const errors = require("../config/errors.config");

async function customerAuthenticationMiddleware (req, res, next) {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken)
           throw errors.Forbidden;

        await tokenizer.verifyAccessToken(accessToken);

        next();
    } catch (err) {
         return res.redirect("/refresh");
    };
};

module.exports = customerAuthenticationMiddleware;