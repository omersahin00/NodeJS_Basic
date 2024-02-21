const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const Blog = require("./blog");

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
});

async function sync() {
    await Category.sync({ alter: true });
    console.log("Category Tablosu Güncellendi.");

    // await Category.create({ name: "Web Geliştirme" });
    // await Category.create({ name: "Mobil Geliştirme" });
    // await Category.create({ name: "Programlama" });

    if (await Category.count() == 0) {
        await Category.bulkCreate([
            { name: "Web Geliştirme" },
            { name: "Mobil Geliştirme" },
            { name: "Programlama" }
        ]);
        console.log("kategoriler eklendi");
    }
}

sync();

module.exports = Category;