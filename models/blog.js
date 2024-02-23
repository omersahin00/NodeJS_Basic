const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    // blogid: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     allowNull: false,
    //     primaryKey: true
    // },
    baslik: {
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
    // categoryid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // }
});

module.exports = Blog;