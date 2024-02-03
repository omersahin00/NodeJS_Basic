const mysql = require("mysql2");
const path = require("path");
const config = require(path.join("../config"));

let connection = mysql.createConnection(config.db);

connection.connect(function(err){
    if (err){
        return console.log(err);
    }
    console.log("MySQL'e bağlandı.");
});

module.exports = connection.promise();
