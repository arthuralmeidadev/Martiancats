const fs = require("fs-extra");
const nodemailer = require("nodemailer");
const gmailCredentials = require("../data/gmailCredentials.json");
const generateValidationCode = require("../helpers/generateValidationCode");
const cachePath = "./cache/emailValidationCodes.json";


async function sendVerificationEmail(req, res) {
    const { signupIssuer, signupFirstName, signupLastName } = req.body;

    const validationCodes = await fs.readJson(cachePath);

    const code = await generateValidationCode(validationCodes.map(entry => entry.code));

    const expiry = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now

    const mailOptions = {
        from: gmailCredentials.provider,
        to: signupIssuer,
        subject: "Verification Code - Martiancats Accounts",
        text: `Hello ${signupFirstName} ${signupLastName} This is your verification code: ${code}`,
        priority: "high"
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: gmailCredentials.provider,
            pass: gmailCredentials.secret,
            clientId: gmailCredentials.clientId,
            clientSecret: gmailCredentials.clientSecret,
            refreshToken: gmailCredentials.refresh_token
        }
    });

    validationCodes.push({ code: code, expiry: expiry });

    await fs.writeJson(cachePath, validationCodes, { spaces: 2});

    transporter.sendMail(mailOptions, (err, email) => {
        if (err) {
            return res.sendStatus(500);
        };

        return res.render("../views/customer/my-account/signup-verification");
    });
};

async function validateCode(req, res) {
    const { code } = req.body;

    const parsedCode = code.join("");

    const validationCodes = await fs.readJson(filePath);

    const updatedFile = validationCodes.filter(
        entry => entry.code !== parsedCode &&
        entry.expiry >= Date.now() / 1000
    );

    await fs.writeJson(cachePath, updatedFile, { spaces: 2});
    
    return res.json({ message: "Welcome to your new account" });
};

module.exports = {
    sendVerificationEmail,
    validateCode
};