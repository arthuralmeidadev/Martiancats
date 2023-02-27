const fs = require("fs-extra");
const cachePath = "./cache/emailValidationCodes.json";
const gmailCredentials = require("../config/gmail.config");
const validationCodes = await fs.readJson(cachePath);
const codesArray = validationCodes.map(entry => entry.code);

function __random() {
    return Math.floor(Math.random() * 10);
};

async function createMail(destiny, name, code) {
    const mailOptions = {
        from: gmailCredentials.provider,
        to: destiny,
        subject: "Verification Code - Martiancats Accounts",
        text: `Hello ${name.first} ${name.last} This is your verification code: ${code}`,
        priority: "high"
    };

    return mailOptions;
};

async function generateCode() {
    const code = `${__random()}${__random()}${__random()}${__random()}${__random()}${__random()}`;
    
    if (codesArray.includes(code)) {
        generateCode();
    } else {
        return code;
    };
};

async function getExpiry() {
    return Math.floor(Date.now() / 1000) + 120;
};

async function saveValidationCode(code, expiry, customerEmail, customerName) {
    validationCodes.push({
        code: code,
        expiry: expiry,
        customerEmail: customerEmail,
        customerName: customerName
    });
    await fs.writeJson(cachePath, validationCodes, { spaces: 2 });
};

async function deleteValidationCode(code) {
    const updatedFile = validationCodes.filter(
        entry => entry.code !== code &&
        entry.expiry >= Math.floor(Date.now() / 1000)
    );
    return updatedFile;
};

async function getCodeEntry(code) {
    const entry = validationCodes.filter(entry =>
        entry.code == code);
    return entry
};

async function isValidEntry(codeEntry, cookiedExpiry) {
    const isValidEntry = codesArray.includes(codeEntry.code) &&
        codeEntry.expiry === cookiedExpiry
    return isValidEntry;
};

async function updateCache(updatedFile) {
    fs.writeJson(cachePath, updatedFile, { spaces: 2 });
};

module.exports = {
    createMail,
    generateCode,
    getExpiry,
    saveValidationCode,
    deleteValidationCode,
    getCodeEntry,
    isValidEntry,
    updateCache
};