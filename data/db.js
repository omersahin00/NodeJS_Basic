const mysql = require("mysql2");
const path = require("path");
const config = require(path.join("../config"));

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host, // localhost
    dialect: "mysql",
});


async function connect() {
    try {
        await sequelize.authenticate();
        console.log("MySQL server bağlantısı yapıldı.");
    }
    catch (error) {
        console.log("Bağlantı hatası: " + error);
    }
}

connect();

module.exports = sequelize;
