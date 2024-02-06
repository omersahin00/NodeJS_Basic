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




router.get("/blogs/:id", function(req, res){
    res.render("admin/blog-edit");
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

    // res.render("admin/blog-list", {title: "Test"});
});

module.exports = router;
