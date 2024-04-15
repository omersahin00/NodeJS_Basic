const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Redirect = sequelize.define("redirect", {
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Redirect;