const nodemailer = require("nodemailer");
const googleAuthenticationData = require("../data/googleAuthenticationData.json");

async function sendVerificationEmail(req, res) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "arthuralmeida.office.dev@gmail.com",
            pass: "Art19-Gvt11",
            clientId: googleAuthenticationData.clientId,
            clientSecret: googleAuthenticationData.clientSecret,
            refreshToken: googleAuthenticationData.refresh_token
        }
    });

    const mailOptions = {
        from: "arthuralmeida.office.dev@gmail.com",
        to: "meupanda374@gmail.com",
        subject: "Nodemailer Project",
        text: "Hi from your nodemailer project",
        priority: "high"
    };

    /*transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        };
    });*/
    
    return res.render("../views/customer/my-account/signup-verification");
};

async function verifyCode(req, res) {
    const { code } = req.body;
    return res.send(code)
};

module.exports = {
    sendVerificationEmail,
    verifyCode
};