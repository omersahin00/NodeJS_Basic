// Express:
const express = require("express");
const app = express();
const config = require("./config");
const fs = require("fs");
const https = require("https");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");

// Node Modules:
const path = require("path");

// Routes:
const routes = require("./routes/index");

// Custom Modules:
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");

// Template Engine:
app.set("view engine", "ejs");
console.log(app.get("view engine"));

// Models:
const Blog = require("./models/blog");
const Category = require("./models/category");
const User = require("./models/user");
const Role = require("./models/role");
const File = require("./models/file");
const Redirect = require("./models/redirect");

// Middleware:
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "b65ecefa-9f3c-4630-b66e-6e851d64d798",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 gün
    },
    store: new SequelizeStore({
        db: sequelize
    })
}));


app.use(locals);
app.use(csurf());

app.use("/libs", express.static(path.join(__dirname, "node_modules"))); // libs -> dosya yolu verilirken node_modules yerine kullanılacak olan ifade (optional)
app.use("/static", express.static(path.join(__dirname, "public"))); // static -> public yerine kullanılacak olan ifade (optional)

app.use(routes);

Blog.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
});
User.hasMany(Blog);

Blog.belongsToMany(Category, { through: "blogCategories" });
Category.belongsToMany(Blog, { through: "blogCategories" });

Role.belongsToMany(User, { through: "userRoles" });
User.belongsToMany(Role, { through: "userRoles" });


(async () => {
    await sequelize.sync({ alter: true });
    await dummyData();
})();

app.listen(config.port, function() {
    console.log(`listening on port ${config.port}`);
});

