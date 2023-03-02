const jwt = require("jsonwebtoken");
const { accessTokenKey, refreshTokenKey } = require("../config/jwt.config");
const errors = require("../config/errors.config");
const refreshTokenClaims = {
    expiresIn: "1d" ,
    notBefore: "3m"
};

async function newAccessToken(payload) {
    try {
        return jwt.sign(payload, accessTokenKey, { expiresIn: "3m" });
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function newRefreshToken(userid) {
    try {
        return jwt.sign({ userid: userid }, refreshTokenKey, refreshTokenClaims);
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function verifyAccessToken(accessToken) {
    try {
        return jwt.verify(accessToken, accessTokenKey);
    } catch (err) {
        throw errors.Unauthorized;
    };
};

async function verifyRefreshToken(refreshToken) {
    try {
        return jwt.verify(refreshToken, refreshTokenKey);
    } catch (err) {
        throw errors.Forbidden;
    };
};

module.exports = {
    newAccessToken,
    newRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}