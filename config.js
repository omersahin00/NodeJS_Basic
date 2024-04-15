const { hotmail } = require("./private/email-info"); // Secret information. (Git not update)

const config = {
    db: {
        host: "localhost",
        user: "root",
        password: "omer237823",
        database: "blogdb"
    },
    email: {
        username: hotmail.username,
        password: hotmail.password,
        from: hotmail.from
    },
    address: {
        local: "127.0.0.1",
        public: "mer.omersahin.keenetic.pro"
    },
    // platform: "local",
    platform: "public",
    port: 3000
}

module.exports = config;