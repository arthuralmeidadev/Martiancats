import crypto from "crypto";
import { errors } from "../config/errors.config.js";
import { keyString, initVectorString } from "../config/encryption.config.js";
const key = Buffer.from(keyString, "hex");
const initVector = Buffer.from(initVectorString, "hex");

async function encrypt(data, type="string") {
    try {
        const cipher = crypto.createCipheriv("aes-256-cbc", key, initVector);

        if (type == "string") {
            let encrypted = cipher.update(data, "utf-8", "hex");
            encrypted += cipher.final("hex");
            return encrypted;

        } else if (type == "object") {
            let encrypted = cipher.update(JSON.stringify(data), "utf-8", "hex");
            encrypted += cipher.final("hex");    
            return { encrypted };
        };
    } catch (err) {
        throw errors.InternalServerError;
    };
};

async function decrypt(data, type="string") {
    try {
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, initVector);

        if (type == "string") {
            let decrypted = decipher.update(data, "hex", "utf-8");
            decrypted += decipher.final("utf-8");
            return decrypted;
            
        } else if (type == "object") {
            let decrypted = decipher.update(data.encrypted, "hex", "utf-8");
            decrypted += decipher.final("utf-8");
            return JSON.parse(decrypted);
        };
    } catch (err) {
        throw errors.InternalServerError;
    };
};

export default {
    encrypt,
    decrypt
};