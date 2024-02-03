const express = require("express");
const app = express();
const path = require("path");

const mysql = require("mysql2");
const config = require(path.join(__dirname, "/config"));

let connection = mysql.createConnection(config.db);
connection.connect(function(err){
    if (err){
        return console.log(err);
    }
    console.log("MySQL'e bağlandı.");

    connection.query("select * from Blog", function(err, result){
        console.log(result);
        result.forEach(element => {
            console.log(element.baslik);
        });
    });
});

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
