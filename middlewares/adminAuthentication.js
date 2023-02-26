const jwt = require('jsonwebtoken');
const payloadEncrypter = require("../helpers/payloadEncrypter");
const { accessTokenKey } = require('../config/jwt.config.js');

async function adminAuthenticationMiddleware(req, res, next) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401);
    };
    const decoded = jwt.verify(accessToken, accessTokenKey);
    res.locals.isOperator = payloadEncrypter.decrypt(decoded).role === "operator";

    next();
};

module.exports = adminAuthenticationMiddleware;