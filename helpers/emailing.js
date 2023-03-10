import fs from "fs-extra";
import { gmailCredentials } from "../config/gmail.config.js";
import { transporter } from "../config/emailing.config.js";
import { errors } from "../config/errors.config.js";
import encrypter from "./encrypter.js";

const cachePath = "./cache/emailValidationCodes.json";

function __random() {
    return Math.floor(Math.random() * 10);
};

function __newCode() {
    return `${__random()}${__random()}${__random()}${__random()}${__random()}${__random()}`;
};

async function createValidationMail(destiny, name, code) {
    try {
        return {
            from: gmailCredentials.PROVIDER,
            to: destiny,
            subject: "Verification Code - Martiancats Accounts",
            text: `Hello ${name.first} ${name.last} This is your verification code: ${code}`,
            priority: "high"
        };
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function createPasswordSetMail(destiny, rep, password) {
    try {
        return {
            from: gmailCredentials.PROVIDER,
            to: destiny,
            subject: "Account Signup Information - Martiancats Accounts",
            text: `Hello ${rep} This is the password for your account: ${password}`+
                `You can change it to a new one in your account options.`,
            priority: "high"
        };
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function generateCode() {
    try {
        const code = __newCode();
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
            email: await encrypter.encrypt(signupIssuer),
            rep: await encrypter.encrypt(representative)
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
            
        entry.email = await encrypter.decrypt(entry.email);
        entry.rep = await encrypter.decrypt(entry.rep);
        return entry;

    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function isValidEntry(code, cookiedExpiry) {
    try {
        const validationCodes = await fs.readJson(cachePath);
        return validationCodes.filter(entry =>
            entry.code === code &&
            entry.expiry === cookiedExpiry);
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function updateCache(updatedFile) {
    try {
        await fs.writeJson(cachePath, updatedFile, { spaces: 2 });
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function sendEmail(mailOptions) {
    try {
        transporter.sendMail(mailOptions);
    } catch (err) {
        throw errors.InternalServerError;
    };
};

export default {
    createValidationMail,
    createPasswordSetMail,
    generateCode,
    getExpiry,
    saveValidationCode,
    deleteValidationCode,
    getCodeEntry,
    isValidEntry,
    updateCache,
    sendEmail
};