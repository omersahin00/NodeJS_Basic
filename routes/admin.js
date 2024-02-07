const express = require("express");
const router = express.Router();
const db = require("../data/db");

router.get("/blogs/create", async function(req, res){
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

router.post("/blogs/create", async function(req, res){
    console.log(req.body);

    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.body.resim;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
        await db.execute("insert into Blog(baslik, aciklama, resim, anasayfa, onay, categoryid) values (?,?,?,?,?,?)", 
            [baslik, aciklama, resim, anasayfa, onay, kategori]);
        res.redirect("/");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs/:id", async function(req, res){
    //res.render("admin/blog-edit");
    const id = req.params.id;
    
    try {
        const [blog] = await db.execute("select * from Blog where blogid = ?", [id]);
        const [categories] = await db.execute("select * from Category");
        if (blog){
            res.render("admin/blog-edit", {
                title: "Blog Edit",
                blog: blog[0],
                categories: categories
            });
        }
        else res.redirect("admin/blogs");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs", async function(req, res){
    try {
        const [blogs] = await db.execute("select blogid, resim, baslik from Blog");
        res.render("admin/blog-list", {
            title: "Blog List",
            blogs: blogs
        });
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router;
