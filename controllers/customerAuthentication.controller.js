import emailing from "../helpers/emailing.js";
import encrypter from "../helpers/encrypter.js";
import tokenizer from "../helpers/tokenizer.js";
import customerManagement from "../helpers/customerManagament.js";
import { cookieOptions } from "../config/expiryCookie.config.js";
import { tokenCookieOptions } from "../config/tokenCookie.config.js";
import { errors } from "../config/errors.config.js";

async function sendVerificationEmail(req, res, next) {
    try {
        const { signupIssuer, signupFirstName, signupLastName } = req.body;
        const fullName = { first: signupFirstName, last: signupLastName };
        const code = await emailing.generateCode();
        const expiry = await emailing.getExpiry();
        const mailOptions = await emailing.createMail(signupIssuer, fullName, code);

        await emailing.saveValidationCode(code, expiry, signupIssuer, fullName);
        await emailing.sendVerificationEmail(mailOptions);
        res.cookie("cookiedExpiry", expiry, cookieOptions);

        return res.render("../views/customer/my-account/signup-verification");

    } catch (err) {
        next(err);
    };
};

async function validateCode(req, res, next) {
    try {
        const { code } = req.body;
        const { cookiedExpiry } = req.cookies;
        const parsedCode = code.join("");
        const isValidEntry = await emailing.isValidEntry(parsedCode, cookiedExpiry);

        if (!isValidEntry) 
            throw errors.ICVC;

        const entry = await emailing.getCodeEntry(parsedCode);
        const updatedFile = await emailing.deleteValidationCode(parsedCode);

        await customerManagement.createCustomer(entry.email, entry.rep);
        await emailing.updateCache(updatedFile);
        res.clearCookie("cookiedExpiry");

        return res.json({ message: "Welcome to your new account" }); // needs to be redirected to login

    } catch (err) {
        next(err);
    };
};

async function grabTokens(req, res, next) {
    try {
        const { email, password } = req.body;
        
        await customerManagement.checkCustomerCredentials(email, password);

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

    } catch (err) {
        next(err);
    };
};

async function resetAccessToken(req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        const decoded = await tokenizer.verifyRefreshToken(refreshToken);
        const refreshTokenPayload = await encrypter.decrypt(decoded);
        const customer = await customerManagement.fetchCustomer(refreshTokenPayload?.email);

        if (!customer || !refreshToken)
            throw errors.ICTK;

        const accessTokenPayload = await encrypter.encrypt({
            userid: customer.email,
            birthdate: customer.password
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
    sendVerificationEmail,
    validateCode,
    grabTokens,
    resetAccessToken
};