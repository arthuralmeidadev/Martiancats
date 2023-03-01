const transporter = require("../config/emailing.config");
const emailing = require("../helpers/emailing");
const encrypter = require("../helpers/encrypter");
const tokenizer = require("../helpers/tokenizer");
const customerManagement = require("../helpers/customerManagament");
const cookieOptions = require("../config/expiryCookie.config");
const tokenCookieOptions = require("../config/tokenCookie.config");

async function sendVerificationEmail(req, res) {
    const { signupIssuer, signupFirstName, signupLastName } = req.body;
    const customerName = { first: signupFirstName, last: signupLastName };
    const code = await emailing.generateCode();
    const expiry = await emailing.getExpiry();
    const mailOptions = await emailing.createMail(signupIssuer, customerName, code);

    await emailing.saveValidationCode(code, expiry, signupIssuer, customerName);

    try {
        transporter.sendMail(mailOptions);
        res.cookie("cookiedExpiry", expiry, cookieOptions);
    } catch (err) {
        console.log(err.message);
        return res.sendStatus(500);
    };

    return res.render("../views/customer/my-account/signup-verification");
};

async function validateCode(req, res) {
    const { code } = req.body;
    const { cookiedExpiry } = req.cookies;
    const parsedCode = code.join("");
    const entry = await emailing.getCodeEntry(parsedCode);
    const updatedFile = await emailing.deleteValidationCode(parsedCode);
    const isValidEntry = await emailing.isValidEntry(entry, cookiedExpiry);
    const email = entry.email;
    const rep = entry.rep;

    if (!isValidEntry) {
        return res.sendStatus(404);
    };

    try {
        await customerManagement.createCustomer(email, rep);
    } catch (err) {
        return res.sendStatus(500);
    };

    await emailing.updateCache(updatedFile);

    res.clearCookie("cookiedExpiry");

    return res.json({ message: "Welcome to your new account" });
};

async function grabTokens(req, res) {
    const { email, password } = req.body;
    const customer = await customerManagement.fetchCustomer(email);
    const isValidCustomer = await customerManagement.isValidCustomer(customer, password);

    if (!customer || !isValidCustomer) {
        return res.sendStatus(401);
    };
    const accessTokenPayload = await encrypter.encrypt({
        email: email,
        password: password,
    });
    const refreshTokenPayload = await encrypter.encrypt({ email: email });
    const accessToken = await tokenizer.newAccessToken(accessTokenPayload);
    const refreshToken = await tokenizer.newRefreshToken(refreshTokenPayload);
    res.cookie("accessToken", accessToken, tokenCookieOptions);
    res.cookie("refreshToken", refreshToken, tokenCookieOptions);
    
    return res.status(200).redirect("/my-account");
};

async function resetAccessToken(req, res) {
    const { refreshToken } = req.cookies;
    const decoded = await tokenizer.verifyRefreshToken(refreshToken);
    const refreshTokenPayload = await encrypter.decrypt(decoded);
    const customer = await customerManagement.fetchCustomer(refreshTokenPayload.email);

    if (!customer || !refreshToken) {
        res.clearCookie("accessToken");
        return res.sendStatus(401);
    };
    const accessTokenPayload = await encrypter.encrypt({
        userid: customer.email,
        birthdate: customer.password
    });
    const accessToken = await tokenizer.newAccessToken(accessTokenPayload);
    res.clearCookie("accessToken");
    res.cookie("accessToken", accessToken, tokenCookieOptions);

    return res.redirect(req.query.path);
};

module.exports = {
    sendVerificationEmail,
    validateCode,
    grabTokens,
    resetAccessToken
};