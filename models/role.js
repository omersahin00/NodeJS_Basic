const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Role = sequelize.define("role", {
    rolename: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Role;