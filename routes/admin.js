const express = require("express");
const router = express.Router();
const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");
const fs = require("fs");

const Blog = require("../models/blog");
const Category = require("../models/category");
const { name } = require("ejs");


router.get("/blogs/delete/:blogid", async function(req, res){
    try {
        const blogid = req.params.blogid;
        const [blog] = await db.execute("select * from Blog where blogid = ?", [blogid]);
        if (blog){
            res.render("admin/blog-delete", {
                title: "Delete Blog",
                blog: blog[0]
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
        res.redirect("/admin/blogs?action=delete&blogid=" + blogid + "&type=blog");
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
            categories: categories
        });    
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/blogs/create", imageUpload.upload.single("resim"), async function(req, res){
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.file.filename;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const icerik = req.body.icerik;

    try {
        await db.execute("insert into Blog(baslik, aciklama, resim, anasayfa, onay, categoryid, icerik) values (?,?,?,?,?,?,?)", 
            [baslik, aciklama, resim, anasayfa, onay, kategori, icerik]);
        res.redirect("/admin/blogs?action=create&type=blog");
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
                blogid: req.query.blogid,
                type: req.query.type
            });
        }
        else res.redirect("admin/blogs");
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/blogs/:blogid", imageUpload.upload.single("resim"), async function(req, res){
    try {
        const blogid = req.body.blogid;
        if (req.params.blogid != blogid) {
            console.log("İşlem gerçekleştirilemedi. \nblogid değerleri eşleşmedi!");
            return redirect("/admin/blogs");
        }
        const baslik = req.body.baslik;
        const aciklama = req.body.aciklama;
        let resim = req.body.resim;

        if (req.file){
            resim = req.file.filename;
            fs.unlink("./public/images/" + req.body.resim, error => {
                console.log(error);
            });
        }
        const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
        const onay = req.body.onay == "on" ? 1 : 0;
        const kategori = req.body.kategori;
        const icerik = req.body.icerik;

        console.log(icerik);
            
        await db.execute("update Blog set baslik = ?, aciklama = ?, resim = ?, anasayfa = ?, onay = ?, categoryid = ?, icerik = ? where blogid = ?", 
        [baslik, aciklama, resim, anasayfa, onay, kategori, icerik, blogid]);
        res.redirect("/admin/blogs?action=edit&blogid=" + blogid + "&type=blog");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/blogs", async function(req, res){
    try {
        const [blogs] = await db.execute("select blogid, resim, baslik from Blog");
        if (blogs){
            res.render("admin/blog-list", {
                title: "Blog List",
                blogs: blogs,
                action: req.query.action,
                blogid: req.query.blogid,
                type: req.query.type
            });
        }
        else res.redirect("/admin/blogs?action=error");
    }
    catch (error) {
        console.log(error);
    }
});



router.get("/category/delete/:categoryid", async function(req, res){
    try {
        const categoryid = req.params.categoryid;
        const [category] = await db.execute("select * from Category where categoryid = ?", [categoryid]);
        if (category){
            res.render("admin/category-delete", {
                title: "Delete Category",
                category: category[0]
            });
        }
        else res.redirect("/admin/category?action=error");
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/category/delete/:categoryid", async function(req, res){
    try {
        const categoryid = req.params.categoryid;
        db.execute("delete from Category where categoryid = ?", [categoryid]);
        res.redirect("/admin/category?action=delete&type=category");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/category/create", async function(req, res){
    try {
        res.render("admin/category-create", {
            title: "Category Create",
            action: req.query.action,
            type: req.query.type
        });
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/category/create", async function(req, res){
    try {
        const newCategory = req.body.title;
        const categories = await Category.findAll();

        if (categories){
            if ((categories.filter(c => c.name.toLowerCase().toUpperCase() == newCategory.toLowerCase().toUpperCase()))[0]){
                // Veri tabanında girilen title ile eşleşen başka bir kayıt varsa buraya girecek
                res.redirect("/admin/category/create?action=error&type=conflict");
            }
            else {
                await Category.create({ name: newCategory });
                res.redirect("/admin/category/create?action=create&type=category");
            }
        }
        else res.redirect("/admin/category?action=error");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/category/:categoryid", async function(req, res){
    try {
        const categoryid = req.params.categoryid;
        const [category] = await db.execute("select * from Category where categoryid = ?", [categoryid]);
        if (category){
            res.render("admin/category-edit", {
                title: "Category Edit",
                category: category[0]
            });
        }
        else res.redirect("/admin/category?action=error");
    }
    catch (error) {
        console.log(error);
    }
});

router.post("/category/:categoryid", async function(req, res){
    try {
        const categoryid = req.body.categoryid;
        if (categoryid != req.params.categoryid){
            console.log("İşlem gerçekleştirilemedi! \ncategoryid eşleşmedi.");
            res.redirect("/admin/category-list?action=error");
        }
        const title = req.body.title;
        await db.execute("update Category set title = ? where categoryid = ?", [title, categoryid]);
        res.redirect("/admin/category?action=edit&type=category");
    }
    catch (error) {
        console.log(error);
    }
});

router.get("/category", async function(req, res){
    try {
        const [categories] = await db.execute("select * from Category");
        if (categories){
            res.render("admin/category-list", {
                title: "Category List",
                categories: categories,
                action: req.query.action,
                type: req.query.type
            });
        }
        else res.redirect("/admin/category?action=error");
    }
    catch (error) {
        console.log(error);
    }
});


module.exports = router;