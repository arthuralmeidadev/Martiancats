const nodemailer = require("nodemailer");
const gmailCredentials = require("./gmail.config.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: gmailCredentials.provider,
        pass: gmailCredentials.provider_secret,
        clientId: gmailCredentials.clientId,
        clientSecret: gmailCredentials.clientSecret,
        refreshToken: gmailCredentials.refresh_token
    }
});

module.exports = transporter;