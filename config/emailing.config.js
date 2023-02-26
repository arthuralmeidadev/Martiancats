const nodemailer = require("nodemailer");
const gmailCredentials = require("./gmail.config.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: gmailCredentials.PROVIDER,
        pass: gmailCredentials.PROVIDER_SECRET,
        clientId: gmailCredentials.CLIENT_ID,
        clientSecret: gmailCredentials.CLIENT_SECRET,
        refreshToken: gmailCredentials.REFRESH_TOKEN
    }
});

module.exports = transporter;