const jwt = require("jsonwebtoken");
const payloadEncrypter = require("../helpers/payloadEncrypter");
const adminManagement = require("../helpers/adminManagement");
const cookieOptions = require("../config/cookie.config");
const refreshTokenClaims = require("../config/refreshToken.config");
const { accessTokenKey, refreshTokenKey } = require("../config/jwt.config");

async function loadAdminLoginPage(req, res) {
    return res.status(200).render("../views/admin/login");
};

async function grabAdminTokens(req, res) {
    const { userid, birthdate, secret } = req.body;
    const admin = await adminManagement.fetchAdmin(userid);
    const roles = await adminManagement.getAdminRoles(admin);       
    const isValidAdmin = await adminManagement.isValidAdmin(admin);

    if (!admin || !isValidAdmin) {
        return res.sendStatus(401);
    };
    const payload = payloadEncrypter.encrypt({
        userid: userid,
        birthdate: birthdate,
        secret: secret,
        role: roles[0].name
    });
    const accessToken = jwt.sign(payload, accessTokenKey, { expiresIn: "3m" });
    const refreshToken = jwt.sign({ userid: userid }, refreshTokenKey, refreshTokenClaims);
    
    res.cookie("accessToken", accessToken, cookieOptions);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    
    return res.status(200).redirect("/admin");
};

async function resetAdminAccessToken(req, res) {
    const { refreshToken } = req.cookies;
    const decoded = jwt.verify(refreshToken, refreshTokenKey);
    const admin = await adminManagement.fetchAdmin(decoded.userid);
    const roles = await adminManagement.getAdminRoles(admin);

    if (!admin || !refreshToken) {
        res.clearCookie("accessToken");
        return res.sendStatus(401);
    };
    const payload = payloadEncrypter.encrypt({
        userid: admin.userid,
        birthdate: admin.birthdate,
        secret: admin.secret,
        role: roles[0].name
    });
    const accessToken = jwt.sign(payload, accessTokenKey, { expiresIn: "3m" });

    res.clearCookie("accessToken");

    res.cookie("accessToken", accessToken, cookieOptions);

    return res.redirect(req.query.path);
};

module.exports = {
    loadAdminLoginPage,
    grabAdminTokens,
    resetAdminAccessToken,
};