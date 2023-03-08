import fs from "fs-extra";
import { gmailCredentials } from "../config/gmail.config.js";
import { transporter } from "../config/emailing.config.js";
import { errors } from "../config/errors.config.js";

const cachePath = "./cache/emailValidationCodes.json";

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
        const validationCodes = await fs.readJson(cachePath);
        const codesArray = validationCodes.map(entry => entry.code);

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

async function saveValidationCode(code, expiry, signupIssuer, fullName) {
    try {
        const representative = fullName?.first + " " + fullName?.last;
        const validationCodes = await fs.readJson(cachePath);
        validationCodes.push({
            code: code,
            expiry: expiry,
            email: signupIssuer,
            rep: representative
        });

        await fs.writeJson(cachePath, validationCodes, { spaces: 2 });

    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function deleteValidationCode(code) {
    try {
        const validationCodes = await fs.readJson(cachePath);
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
        const validationCodes = await fs.readJson(cachePath);

        const [entry] = (validationCodes.filter(entry =>
            entry.code === code));
            
        return entry;
    } catch (err) {
        return errors.InternalServerError;
    };
};

async function isValidEntry(code, cookiedExpiry) {
    try {
        const validationCodes = await fs.readJson(cachePath);
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

export default {
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