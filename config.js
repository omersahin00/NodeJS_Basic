const emailInfo = require("./private/email-info"); // Secret information. (Git not update)

const config = {
    db: {
        host: "localhost",
        user: "root",
        password: "omer237823",
        //database: "blogapp"
        database: "blogdb"
    },
    email: {
        username: emailInfo.username,
        password: emailInfo.password,
        from: emailInfo.from
    }
}

module.exports = config;