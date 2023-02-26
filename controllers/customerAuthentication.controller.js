const transporter = require("../config/emailing.config");
const emailing = require("../helpers/emailing");
const cookieOptions = require("../config/expiryCookie.config")

async function sendVerificationEmail(req, res) {
    const { signupIssuer, signupFirstName, signupLastName } = req.body;
    const customerName = { first: signupFirstName, last: signupLastName };
    const code = await emailing.generateCode();
    const expiry = await emailing.getExpiry();
    const mailOptions = await emailing.createMail(signupIssuer, customerName, code);

    await emailing.saveValidationCode(code, expiry);

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

    if (!isValidEntry) {
        return res.sendStatus(404);
    };

    await emailing.updateCache(updatedFile);

    res.clearCookie("cookiedExpiry");

    return res.json({ message: "Welcome to your new account" });
};

module.exports = {
    sendVerificationEmail,
    validateCode
};