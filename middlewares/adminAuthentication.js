const jwt = require('jsonwebtoken');
const payloadEncrypter = require("../helpers/payloadEncrypter");
const accessTokenKey = require('../data/jwtSignatureKeys.json')[0];

async function adminAuthenticationMiddleware (req, res, next) {
    if (!req.cookies.accessToken) {
        return res.status(401).send("No access token found");
    };

    jwt.verify(req.cookies.accessToken, accessTokenKey, (err, decoded) => {
        if (err) {
            return res.redirect(`/admin/refresh/?path=/admin${req.url}`);
        };

        res.locals.isOperator = payloadEncrypter.decrypt(decoded).role === "operator";

        next();
    });
};

module.exports = adminAuthenticationMiddleware;