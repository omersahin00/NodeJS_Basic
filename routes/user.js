const express = require("express");
const router = express.Router();

const db = require("../data/db");

const Blog = require("../models/blog");
const Category = require("../models/category");

router.get("/blogs/category/:categoryid", async function(req, res) {
    try {
        const categoryid = req.params.categoryid;
        const [blogs] = await db.execute("select * from Blog where categoryid = ?", [categoryid]);
        const [categories] = await db.execute("select * from Category");
        if (blogs) {
            id = parseInt(categoryid);
            res.render("users/blogs", {
                selectedCategory: id,
                title: categories[--id].title,
                blogs: blogs,
                categories: categories,
            });
        }
        else res.redirect("/");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs/:blogid", async function(req, res){
    try {
        const blogID = req.params.blogid;
        const [blogs] = await db.execute("select * from Blog where blogid = ?", [blogID]);
        const blog = blogs[0];
        if (blog){
            res.render("users/blog-details", {
                title: blog.baslik,
                blog: blog
            });
        }
        else res.redirect("/");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs", async function(req, res){
    try {
        const [blogs] = await db.execute("select * from Blog where onay = 1");
        const [categories] = await db.execute("select * from Category");
        res.render("users/blogs", {
            title: "Popüler Kurslar",
            blogs: blogs, 
            categories: categories,
            selectedCategory: -1
        });
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/", async function(req, res){
    try {
        const [blogs] = await db.execute("select * from Blog where anasayfa = 1");
        const [categories] = await db.execute("select * from Category");
        res.render("users/index", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: 0
        });
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router;
