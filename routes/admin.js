const express = require("express");
const router = express.Router();
const db = require("../data/db");


router.get("/blogs/delete/:blogid", async function(req, res){
    try {
        const blogid = req.params.blogid;
        const [blog] = await db.execute("select * from Blog where blogid = ?", [blogid]);
        if (blog){
            res.render("admin/blog-delete", {
                title: "Delete Blog",
                blog: blog[0],
                action: req.query.action,
                blogid: req.query.blogid
            });
        }
        else redirect("/admin/blogs");
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/blogs/delete/:blogid", async function(req, res){
    try {
        const blogid = req.body.blogid;
        db.execute("delete from Blog where blogid = ?", [blogid]);
        res.redirect("/admin/blogs?action=delete&blogid=" + blogid);
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs/create", async function(req, res){
    try {
        const [categories] = await db.execute("select * from Category");
        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories,
            action: req.query.action,
            blogid: req.query.blogid
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
        res.redirect("/admin/blogs?action=create");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs/:id", async function(req, res){
    const id = req.params.id;
    try {
        const [blog] = await db.execute("select * from Blog where blogid = ?", [id]);
        const [categories] = await db.execute("select * from Category");
        if (blog){
            res.render("admin/blog-edit", {
                title: "Blog Edit",
                blog: blog[0],
                categories: categories,
                action: req.query.action,
                blogid: req.query.blogid
            });
        }
        else res.redirect("admin/blogs");
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/blogs/:blogid", async function(req, res){
    try {
        const blogid = req.body.blogid;
        if (req.params.blogid != blogid) {
            console.log("İşlem gerçekleştirilemedi. \nblogid değerleri eşleşmedi!");
            return redirect("/admin/blogs");
        }
        const baslik = req.body.baslik;
        const aciklama = req.body.aciklama;
        const resim = req.body.resim;
        const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
        const onay = req.body.onay == "on" ? 1 : 0;
        const kategori = req.body.kategori;

        await db.execute("update Blog set baslik = ?, aciklama = ?, resim = ?, anasayfa = ?, onay = ?, categoryid = ? where blogid = ?", 
        [baslik, aciklama, resim, anasayfa, onay, kategori, blogid]);
        res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
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
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router;
