import encrypter from "../helpers/encrypter.js";
import tokenizer from "../helpers/tokenizer.js";
import adminManagement from "../helpers/adminManagement.js";
import { tokenCookieOptions } from "../config/tokenCookie.config.js";
import { errors } from "../config/errors.config.js";

async function loadAdminLoginPage(req, res, next) {
    try {
        return res.status(200).render("../views/admin/login");
    } catch (err) {
        next(err);
    };
};

async function grabTokens(req, res, next) {
    try {
        const { userid, birthdate, secret } = req.body;
        
        await adminManagement.checkAdminCredentials(userid, birthdate, secret);

        const role = await adminManagement.getRole(userid);
        const accessTokenPayload = await encrypter.encrypt({
            userid: userid,
            birthdate: birthdate,
            secret: secret,
            role: role
        });
        const accessToken = await tokenizer.newAccessToken(accessTokenPayload);
        const refreshTokenPayload = await encrypter.encrypt({ userid: userid });
        const refreshToken = await tokenizer.newRefreshToken(refreshTokenPayload);
        res.cookie("accessToken", accessToken, tokenCookieOptions);
        res.cookie("refreshToken", refreshToken, tokenCookieOptions);
        
        return res.status(200).redirect("/admin");

    } catch (err) {
        next(err);
    };
};

async function resetAccessToken(req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        const decoded = await tokenizer.verifyRefreshToken(refreshToken);
        const refreshTokenPayload = await encrypter.decrypt(decoded);
        const admin = await adminManagement.fetchAdmin(refreshTokenPayload?.userid);

        if (!admin || !refreshToken)
            throw errors.Forbidden;

        const role = await adminManagement.getRole(refreshTokenPayload?.userid);
        const accessTokenPayload = await encrypter.encrypt({
            userid: admin.userid,
            birthdate: admin.birthdate,
            secret: admin.secret,
            role: role
        });
        const accessToken = await tokenizer.newAccessToken(accessTokenPayload);
        res.clearCookie("accessToken");
        res.cookie("accessToken", accessToken, tokenCookieOptions);

        return res.redirect(req.query.path);
        
    } catch (err) {
        next(err);
    };
};

export default {
    loadAdminLoginPage,
    grabTokens,
    resetAccessToken,
};