const fs = require("fs-extra");
const nodemailer = require("nodemailer");
const gmailCredentials = require("../data/gmailCredentials.json");
const generateValidationCode = require("../helpers/generateValidationCode");

async function sendVerificationEmail(req, res) {
    const { signupIssuer, signupFirstName, signupLastName } = req.body;
    
    const filePath = "./cache/emailValidationCodes.json";
    const validationCodes = fs.readJsonSync(filePath);
    const code = await generateValidationCode(validationCodes.map(entry => entry.code));
    const expiry = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now

    validationCodes.push({ code: code, expiry: expiry });

    fs.writeJson(filePath, validationCodes, (err) => {
        if (err) {
            return res.sendStatus(500);
        };

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

        transporter.sendMail(mailOptions, (err, email) => {
            if (err) {
                return res.sendStatus(500);
            };

            return res.render("../views/customer/my-account/signup-verification");
        });
    });
};

async function validateCode(req, res) {
    const { code } = req.body;

    const parsedCode = code.join("");

    const filePath = "./cache/emailValidationCodes.json";

    const validationCodes = fs.readJsonSync(filePath);
    
    const updatedFile = validationCodes.filter(
        entry => entry.code !== parsedCode &&
        entry.expiry >= Date.now() / 1000
    );

    fs.writeJson("./cache/emailValidationCodes.json", updatedFile, (err) => {
        if (err) {
            return res.sendStatus(500);
        };

        return res.json({ message: "Welcome to your new account" });
    });
};

module.exports = {
    sendVerificationEmail,
    validateCode
};