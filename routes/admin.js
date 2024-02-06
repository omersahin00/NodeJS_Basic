const express = require("express");
const router = express.Router();
const db = require("../data/db");

router.use("/blogs/create", async function(req, res){
    try {
        const [categories] = await db.execute("select * from Category");
        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories
        });    
    }
    catch (error) {
        console.log(error);
    }
});

router.use("/blogs/:id", function(req, res){
    res.render("admin/blog-edit");
});

router.use("/blogs", function(req, res){
    res.render("admin/blog-list");
});

module.exports = router;
