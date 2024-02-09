const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/images");
    },
    filename: function(req, file, callback){
        callback(null, path.parse(file.originalname).name + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer ({
    storage: storage
});

module.exports.upload = upload;
