const express = require("express");
const app = express();
const path = require("path");

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

app.set("view engine", "ejs");
console.log(app.get("view engine"));

app.use("/libs", express.static(path.join(__dirname, "node_modules"))); // libs -> dosya yolu verilirken node_modules yerine kullanılacak olan ifade (optional)
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use(userRouter);

app.listen(3000, function() {
    console.log("listening on port 3000");
});
