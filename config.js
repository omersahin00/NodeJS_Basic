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
        local: "127.0.0.1:3000/",
        public: "mer.omersahin.keenetic.pro/"
    }
}

module.exports = config;