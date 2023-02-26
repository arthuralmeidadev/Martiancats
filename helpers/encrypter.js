const crypto = require("crypto");
const { keyString, initVectorString } = require("../config/encryption.config");

async function encrypt(object) {
    try {
        const key = Buffer.from(keyString, "hex");
        const initVector = Buffer.from(initVectorString, "hex");
        const cipher = crypto.createCipheriv("aes-256-cbc", key, initVector);
        let encrypted = cipher.update(JSON.stringify(object), "utf-8", "hex");
        encrypted += cipher.final("hex");
        
        return { encrypted };
    } catch (err) {
        throw err;
    };
};

async function decrypt(object) {
    try {
        const key = Buffer.from(encryptionKeys[0], "hex");
        const initVector = Buffer.from(encryptionKeys[1], "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, initVector);
        let decrypted = decipher.update(object.encrypted, "hex", "utf-8");
        decrypted += decipher.final("utf-8");

        return JSON.parse(decrypted);
    } catch (err) {
        throw err;
    };
};

module.exports = {
    encrypt,
    decrypt
};