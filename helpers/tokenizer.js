import jwt from "jsonwebtoken";
import { accessTokenKey, refreshTokenKey } from "../config/jwt.config.js";
import { errors } from "../config/errors.config.js";
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

async function newRefreshToken(payload) {
    try {
        return jwt.sign(payload, refreshTokenKey, refreshTokenClaims);
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

export default {
    newAccessToken,
    newRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};