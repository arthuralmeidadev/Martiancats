const fs = require("fs-extra");
const gmailCredentials = require("../data/gmailCredentials.json");
const generateCode = require("../helpers/generateCode");
const transporter = require("../helpers/emailTransporter")

const cachePath = "./cache/emailValidationCodes.json";

async function sendVerificationEmail(req, res) {
    const { signupIssuer, signupFirstName, signupLastName } = req.body;
    const validationCodes = await fs.readJson(cachePath);
    const code = await generateCode(validationCodes.map(entry => entry.code));
    const expiry = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now

    const mailOptions = {
        from: gmailCredentials.provider,
        to: signupIssuer,
        subject: "Verification Code - Martiancats Accounts",
        text: `Hello ${signupFirstName} ${signupLastName} This is your verification code: ${code}`,
        priority: "high"
    };

    validationCodes.push({ code: code, expiry: expiry });
    await fs.writeJson(cachePath, validationCodes, { spaces: 2 });

    try {
        transporter.sendMail(mailOptions)
    } catch (err) {
        console.group(err.message);
        return res.sendStatus(500);
    };

    res.cookie("cookiedExpiry", expiry, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 2 * 60 * 1000
    });

    return res.render("../views/customer/my-account/signup-verification");
};

async function validateCode(req, res) {
    const { code } = req.body;
    const { cookiedExpriry } = req.cookies;
    const parsedCode = code.join("");
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

    return res.json({ message: "Welcome to your new account" });
};

module.exports = {
    sendVerificationEmail,
    validateCode
};