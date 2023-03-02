const encrypter = require("../helpers/encrypter");
const tokenizer = require("../helpers/tokenizer");
const adminManagement = require("../helpers/adminManagement");
const cookieOptions = require("../config/tokenCookie.config");
const errors = require("../config/errors.config");

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
        const isValidAdmin = await adminManagement.isValidAdmin(userid, birthdate, secret);

        if (!isValidAdmin)
            throw errors.Unauthorized;

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
        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);
        
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
        res.cookie("accessToken", accessToken, cookieOptions);

        return res.redirect(req.query.path);
        
    } catch (err) {
        next(err);
    };
};

module.exports = {
    loadAdminLoginPage,
    grabTokens,
    resetAccessToken,
};