const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    baslik: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aciklama: {
        type: DataTypes.STRING,
        allowNull: true
    },
    icerik: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resim: {
        type: DataTypes.STRING,
        allowNull: true
    },
    anasayfa: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    onay: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Blog;