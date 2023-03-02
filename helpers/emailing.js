const fs = require("fs-extra");
const cachePath = "./cache/emailValidationCodes.json";
const gmailCredentials = require("../config/gmail.config");
const validationCodes = await fs.readJson(cachePath);
const codesArray = validationCodes.map(entry => entry.code);
const transporter = require("../config/emailing.config");
const errors = require("../config/errors.config");

function __random() {
    return Math.floor(Math.random() * 10);
};

async function createMail(destiny, name, code) {
    try {
        return {
            from: gmailCredentials.provider,
            to: destiny,
            subject: "Verification Code - Martiancats Accounts",
            text: `Hello ${name.first} ${name.last} This is your verification code: ${code}`,
            priority: "high"
        };
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function generateCode() {
    try {
        const code = `${__random()}${__random()}${__random()}${__random()}${__random()}${__random()}`;
    
        if (codesArray.includes(code))
            generateCode();
        return code;
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function getExpiry() {
    try {
        return Math.floor(Date.now() / 1000) + 120;
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function saveValidationCode(code, expiry, customerEmail, customerName) {
    try {
        validationCodes.push({
            code: code,
            expiry: expiry,
            customerEmail: customerEmail,
            customerName: customerName
        });
        await fs.writeJson(cachePath, validationCodes, { spaces: 2 });
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function deleteValidationCode(code) {
    try {
        return validationCodes.filter(
            entry => entry.code !== code &&
            entry.expiry >= Math.floor(Date.now() / 1000)
        );
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function getCodeEntry(code) {
    try {
        return validationCodes.filter(entry =>
            entry.code === code);
    } catch (err) {
        return errors.InternalServerError;
    };
};

async function isValidEntry(code, cookiedExpiry) {
    try {
        return validationCodes.filter(entry =>
            entry.code === code &&
            entry.expiry === cookiedExpiry);
    } catch (err) {
        return errors.InternalServerError;
    };
};

async function updateCache(updatedFile) {
    try {
        await fs.writeJson(cachePath, updatedFile, { spaces: 2 });
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function sendVerificationEmail(mailOptions) {
    try {
        transporter.sendMail(mailOptions);
    } catch (err) {
        throw errors.InternalServerError;
    };
};

module.exports = {
    createMail,
    generateCode,
    getExpiry,
    saveValidationCode,
    deleteValidationCode,
    getCodeEntry,
    isValidEntry,
    updateCache,
    sendVerificationEmail
};