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
    }
}

module.exports = config;