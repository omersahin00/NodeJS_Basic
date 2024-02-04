const express = require("express");
const router = express.Router();

const db = require("../data/db"); 

router.use("/blogs/:blogid", async function(req, res){
    try {
        const blogID = req.params.blogid;
        const [blog] = await db.execute("select * from Blog where blogid = ?", [blogID]);
        res.render("users/blog-details", {
            title: blog[0].baslik,
            blog: blog[0]
        });
    }
    catch (error) {
        console.log(error);
    }
});

router.use("/blogs", async function(req, res){
    try {
        const [blogs] = await db.execute("select * from Blog where onay = 1");
        const [categories] = await db.execute("select * from Category");
        res.render("users/blogs", {
            title: "Popüler Kurslar",
            blogs: blogs, 
            categories: categories
        });
    }
    catch (error) {
        console.log(error);
    }
});

router.use("/", async function(req, res){
    try {
        const [blogs] = await db.execute("select * from Blog where anasayfa = 1");
        const [categories] = await db.execute("select * from Category");
        res.render("users/index", {
            title: "Tüm Kursler",
            blogs: blogs,
            categories: categories
        });
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router;
