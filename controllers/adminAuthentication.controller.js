const encrypter = require("../helpers/encrypter");
const tokenizer = require("../helpers/tokenizer");
const adminManagement = require("../helpers/adminManagement");
const cookieOptions = require("../config/tokenCookie.config");

async function loadAdminLoginPage(req, res) {
    return res.status(200).render("../views/admin/login");
};

async function grabTokens(req, res) {
    const { userid, birthdate, secret } = req.body;
    const admin = await adminManagement.fetchAdmin(userid);
    const roles = await adminManagement.getRoles(admin);       
    const isValidAdmin = await adminManagement.isValidAdmin(admin, birthdate, secret);

    if (!admin || !isValidAdmin)
        return res.sendStatus(401);

    const accessTokenPayload = await encrypter.encrypt({
        userid: userid,
        birthdate: birthdate,
        secret: secret,
        role: roles[0]?.name
    });
    const accessToken = await tokenizer.newAccessToken(accessTokenPayload);
    const refreshTokenPayload = await encrypter.encrypt({ userid: userid });
    const refreshToken = await tokenizer.newRefreshToken(refreshTokenPayload);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    
    return res.status(200).redirect("/admin");
};

async function resetAccessToken(req, res) {
    const { refreshToken } = req.cookies;
    const decoded = await tokenizer.verifyRefreshToken(refreshToken);
    const refreshTokenPayload = await encrypter.decrypt(decoded);
    const admin = await adminManagement.fetchAdmin(refreshTokenPayload?.userid);
    const roles = await adminManagement.getRoles(admin);

    if (!admin || !refreshToken) {
        res.clearCookie("accessToken");
        return res.sendStatus(401);
    };
    const accessTokenPayload = await encrypter.encrypt({
        userid: admin?.userid,
        birthdate: admin?.birthdate,
        secret: admin?.secret,
        role: roles[0]?.name
    });
    const accessToken = await tokenizer.newAccessToken(accessTokenPayload);
    res.clearCookie("accessToken");
    res.cookie("accessToken", accessToken, cookieOptions);

    return res.redirect(req.query.path);
};

module.exports = {
    loadAdminLoginPage,
    grabTokens,
    resetAccessToken,
};