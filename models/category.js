const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("category", {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Category;