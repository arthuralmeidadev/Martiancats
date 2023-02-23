const gmailCredentials = require("../data/gmailCredentials.json");

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

module.exports = createMail;