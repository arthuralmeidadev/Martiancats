const jwt = require("jsonwebtoken");
const database = require("../models/initialization");
const payloadEncrypter = require("../helpers/payloadEncrypter");

const jwtSignatureKeys = require("../data/jwtSignatureKeys.json");
const accessTokenKey = jwtSignatureKeys[0];
const refreshTokenKey = jwtSignatureKeys[1];

const Admin = database.admin;

async function loadAdminLoginPage(req, res) {
    return res.status(200).render("../views/admin/login");
};

async function grabAdminTokens(req, res) {
    const { userid, birthdate, secret } = req.body;

    Admin.findOne({ where: { id: userid } })
    .then(admin => {
        if (!admin) {
            return res.status(401).send("Not a valid admin");
        };

        if (birthdate === admin.birthdate && secret === admin.secret) {
            admin.getRoles()
            .then(roles => {                
                const payload = payloadEncrypter.encrypt({
                    userid: userid,
                    birthdate: birthdate,
                    secret: secret,

                    role: roles[0].name
                });
                const refreshTokenClaims = {
                    expiresIn: "1d" ,
                    notBefore: "3m"
                };
        
                const accessToken = jwt.sign(payload, accessTokenKey, { expiresIn: "3m"});
        
                const refreshToken = jwt.sign({ userid: userid }, refreshTokenKey, refreshTokenClaims);
        
                res.cookie("accessToken", accessToken, {
                    secure: true,
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                });
                
                res.cookie("refreshToken", refreshToken, {
                    secure: true,
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                });
                
                return res.status(200).redirect("/admin");
            });
        };
    });
};

async function resetAdminAccessToken(req, res) {
    if (!req.cookies.refreshToken) {
        if (req.cookies.accessToken) {
            res.clearCookie("accessToken");
        };
        
        return res.status(401).send("No refresh token found");
    };
    
    const refreshToken = req.cookies.refreshToken;

    jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
        if (err) {
            return res.status(406).send("Invalid refresh token");

        } else {
            
            Admin.findOne({ where: { id: decoded.userid } })
            .then(admin => {
                if (!admin) {
                    return res.status(401).send("Not a valid admin");
                };

                admin.getRoles()
                .then(roles => { 
                    const payload = payloadEncrypter.encrypt({
                        userid: admin.userid,
                        birthdate: admin.birthdate,
                        secret: admin.secret,

                        role: roles[0].name
                    });
                

                    const accessToken = jwt.sign(payload, accessTokenKey, { expiresIn: "3m" });
        
                    res.clearCookie("accessToken");
                    res.cookie("accessToken", accessToken, {
                        secure: true,
                        httpOnly: true,
                        sameSite: "lax",
                        maxAge: 24 * 60 * 60 * 1000
                    });

                    return res.redirect(req.query.path);
                });
            });
        };
    });
};

module.exports = {
    loadAdminLoginPage,
    grabAdminTokens,
    resetAdminAccessToken,
};