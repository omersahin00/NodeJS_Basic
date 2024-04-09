const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const File = sequelize.define("file", {
    filename: {
        type: DataTypes.STRING,
        allowNull: true
    },
    originalname: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = File;