const nodemailer = require("nodemailer");
const gmailCredentials = require("../data/gmailCredentials.json");

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

module.exports = transporter;