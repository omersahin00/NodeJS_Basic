const express = require("express");
const app = express();
const path = require("path");
var cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
console.log(app.get("view engine"));

app.use("/libs", express.static(path.join(__dirname, "node_modules"))); // libs -> dosya yolu verilirken node_modules yerine kullanılacak olan ifade (optional)
app.use("/static", express.static(path.join(__dirname, "public"))); // static -> public yerine kullanılacak olan ifade (optional)
 
app.use("/admin", adminRouter);
app.use("/account", authRouter);
app.use(userRouter);

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");

const Blog = require("./models/blog");
const Category = require("./models/category");
const User = require("./models/user");

Blog.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
});
User.hasMany(Blog);

Blog.belongsToMany(Category, { through: "blogCategories" });
Category.belongsToMany(Blog, { through: "blogCategories" });


(async () => {
    await sequelize.sync({ alter: true });
    await dummyData();
})();


app.listen(3000, function() {
    console.log("listening on port 3000");
});
