const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("category", {
    categoryid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
}
);

async function sync() {
    await Category.sync({ force: true });
    console.log("Category Tablosu Güncellendi.");
}

sync();

module.exports = Category;