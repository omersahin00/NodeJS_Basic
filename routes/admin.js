const express = require("express");
const router = express.Router();

router.use("/blogs/create", function(req, res){
    res.render("admin/blog-create");
});

router.use("/blogs/:id", function(req, res){
    res.render("admin/blog-edit");
});

router.use("/blogs", function(req, res){
    res.render("admin/blog-list");
});

module.exports = router;