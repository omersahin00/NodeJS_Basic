const { hotmail: mail } = require("./private/email-info"); // Secret information. (Git not update)

const config = {
    db: {
        host: "localhost",
        user: "root",
        password: "omer237823",
        database: "blogdb"
    },
    email: {
        username: mail.username,
        password: mail.password,
        from: mail.from
    },
    address: {
        local: "127.0.0.1",
        public: "*****"
    },
    platform: "local",
    // platform: "public",
    port: 3000
}

module.exports = config;