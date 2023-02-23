const jwt = require('jsonwebtoken');
const payloadEncrypter = require("../helpers/payloadEncrypter");
const accessTokenKey = require('../data/jwtSignatureKeys.json')[0];

async function adminAuthenticationMiddleware (req, res, next) {
    if (!req.cookies.accessToken) {
        return res.status(401).send("No access token found");
    };
    const decoded = jwt.verify(req.cookies.accessToken, accessTokenKey);
    res.locals.isOperator = payloadEncrypter.decrypt(decoded).role === "operator";

    next();
};

module.exports = adminAuthenticationMiddleware;