const fs = require("fs-extra");
const transporter = require("../helpers/emailTransporter");
const generateCode = require("../helpers/generateCode");
const createMail = require("../helpers/mailCreator");
const saveValidationCode = require("../helpers/saveValidationCode");

async function sendVerificationEmail(req, res) {
    const { signupIssuer, signupFirstName, signupLastName } = req.body;
    const customerName = { first: signupFirstName, last: signupLastName };
    const code = await generateCode();
    const expiry = Math.floor(Date.now() / 1000) + 120;
    const mailOptions = await createMail(signupIssuer, customerName, code);

    await saveValidationCode(code, expiry);

    try {
        transporter.sendMail(mailOptions);
        res.cookie("cookiedExpiry", expiry, {
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 2 * 60 * 1000
        });
    } catch (err) {
        console.log(err.message);
        return res.sendStatus(500);
    };

    return res.render("../views/customer/my-account/signup-verification");
};

async function validateCode(req, res) {
    const { code } = req.body;
    const { cookiedExpriry } = req.cookies;
    const parsedCode = code.join("");
    const cachePath = "./cache/emailValidationCodes.json";
    const validationCodes = await fs.readJson(cachePath);

    const updatedFile = validationCodes.filter(
        entry => entry.code !== parsedCode &&
        entry.expiry >= Math.floor(Date.now() / 1000)
    );

    const entry = validationCodes.filter(entry =>
        entry.code == parsedCode);

    if (!validationCodes.map(entry =>
        entry.code).includes(parsedCode) ||
        entry.expiry !== cookiedExpriry) {
            
        return res.sendStatus(404);
    };

    await fs.writeJson(cachePath, updatedFile, { spaces: 2 });

    res.clearCookie("cookiedExpiry");

    return res.json({ message: "Welcome to your new account" });
};

module.exports = {
    sendVerificationEmail,
    validateCode
};