const tokenizer = require("../helpers/tokenizer");

async function customerAuthenticationMiddleware (req, res, next) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401);
    } else {
        try {
            await tokenizer.verifyAccessToken(accessToken);
        } catch (err) {
            return res.redirect("/refresh")
        };
    };

    next();
};

module.exports = customerAuthenticationMiddleware;