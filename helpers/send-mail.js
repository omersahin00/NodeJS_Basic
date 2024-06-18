const nodemailer = require("nodemailer");
const config = require("../config");

// Outlook Mailer:
var transporterOutlook = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secure: false,
    port: 587,
    starttls: {
        ciphers: 'SSLv3',
    },
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
});

// Gmail Mailer:
var transporterGmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
});

module.exports = transporterOutlook;