const Blog = require("../models/blog");
const Category = require("../models/category");
const fs = require("fs");
const { Op } = require("sequelize");
const sequelize = require("../data/db");
const slugField = require("../helpers/slugfield");


exports.get_blog_delete = async function(req, res){
    try {
        const blogid = req.params.blogid;
        const blog = await Blog.findAll({
            where: { id: blogid }
        });
        if (blog){
            blog.blogid = blog.id;
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
}

exports.post_blog_delete = async function(req, res){
    try {
        const blogid = req.body.blogid;
        await Blog.destroy({
            where: { id: blogid }
        });
        res.redirect("/admin/blogs?action=delete&blogid=" + blogid + "&type=blog");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_blog_create = async function(req, res){
    try {
        const categories = await Category.findAll();
        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories
        });    
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_blog_create = async function(req, res){
    const baslik = req.body.baslik;
    const url = slugField(baslik);
    const aciklama = req.body.aciklama;
    const resim = req.file.filename;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const icerik = req.body.icerik;
    const categoryIds = req.body.categories;
    
    try {
        const newBlog = await Blog.create({
            baslik: baslik,
            url: url,
            aciklama: aciklama,
            resim: resim,
            anasayfa: anasayfa,
            onay: onay,
            icerik: icerik
        });

        const selectedCategories = await Category.findAll({
            where: {
                id: {
                    [Op.in]: categoryIds
                }
            }
        });
        newBlog.addCategories(selectedCategories);
        
        res.redirect("/admin/blogs?action=create&type=blog");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_blog_edit = async function(req, res){
    const blogid = req.params.blogid;
    try {
        const blog = await Blog.findOne({
            where: {
                id: blogid
            },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        const categories = await Category.findAll();

        if (blog && categories) {
            blog.blogid = blog.id;
            res.render("admin/blog-edit", {
                title: "Blog Edit",
                blog: blog.dataValues,
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
}

exports.post_blog_edit = async function(req, res){
    try {
        const blogid = req.body.id;
        if (req.params.blogid != blogid) {
            console.log("İşlem gerçekleştirilemedi. \nblogid değerleri eşleşmedi!");
            return redirect("/admin/blogs");
        }
        const baslik = req.body.baslik;
        const aciklama = req.body.aciklama;
        const icerik = req.body.icerik;
        const categoryIds = req.body.categories;
        let resim = req.body.resim;
        
        if (req.file){
            resim = req.file.filename;
            fs.unlink("./public/images/" + req.body.resim, error => {
                console.log(error);
            });
        }

        const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
        const onay = req.body.onay == "on" ? 1 : 0;
 
        try {
            const blog = await Blog.findOne({
                where: {
                    id: blogid,
                },
                include: {
                    model: Category,
                    attributes: ["id"]
                }
            });

            if (blog) {
                blog.baslik = baslik,
                blog.aciklama = aciklama,
                blog.resim = resim,
                blog.anasayfa = anasayfa,
                blog.onay = onay,
                blog.icerik = icerik

                if (categoryIds == undefined) {
                    await blog.removeCategories(blog.categories);
                }
                else {
                    await blog.removeCategories(blog.categories);
                    const selectedCategories = await Category.findAll({
                        where: {
                            id: {
                                [Op.in]: categoryIds
                            }
                        }
                    });
                    await blog.addCategories(selectedCategories);
                }

                await blog.save();
                res.redirect("/admin/blogs?action=edit&blogid=" + blogid + "&type=blog");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_blogs = async function(req, res){
    try {
        const blogs = await Blog.findAll({
            attributes: ["id", "resim", "baslik", "url"],
            include: {
                model: Category,
                attributes: ["name"]
            }
        });
        
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
}



exports.get_category_delete = async function(req, res){  
    try {
        const categoryid = req.params.categoryid;
        const category = await Category.findAll({
            where: { id: categoryid }
        });
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
}

exports.post_category_delete = async function(req, res){
    try {
        const categoryid = req.params.categoryid;
        await Category.destroy({
            where: { id: categoryid }
        });
        res.redirect("/admin/category?action=delete&type=category");
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_category_remove = async function(req, res){
    const blogid = req.body.blogid;
    const categoryid = req.body.categoryid;
    
    await sequelize.query(`delete from blogCategories where blogId = ${blogid} and categoryId = ${categoryid}`);
    res.redirect("/admin/category/" + categoryid);
}

exports.get_category_create = async function(req, res){
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
}

exports.post_category_create = async function(req, res){
    try {
        const newCategory = req.body.name;
        const categories = await Category.findAll();
        await Category.create({ name: newCategory });
        res.redirect("/admin/category?action=create&type=category");

        // if (categories){
        //     if ((categories.filter(c => c.name.toLowerCase().toUpperCase() == newCategory.toLowerCase().toUpperCase()))[0]){
        //         // Veri tabanında girilen title ile eşleşen başka bir kayıt varsa buraya girecek
        //         res.redirect("/admin/category/create?action=error&type=conflict");
        //     }
        //     else {
        //         await Category.create({ name: newCategory });
        //         res.redirect("/admin/category?action=create&type=category");
        //     }
        // }
        // else res.redirect("/admin/category?action=error");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_category_edit = async function(req, res){
    try {
        const categoryid = req.params.categoryid;

        const category = await Category.findByPk(categoryid);
        const countBlog = await category.countBlogs();
        const blogs = await category.getBlogs();

        if (category){
            res.render("admin/category-edit", {
                title: "Category Edit",
                category: category,
                blogs: blogs,
                countBlog: countBlog
            });
        }
        else res.redirect("/admin/category?action=error");
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_categoy_edit = async function(req, res){
    try {
        const categoryid = req.body.categoryid;
        
        if (categoryid != req.params.categoryid){
            console.log("İşlem gerçekleştirilemedi! \ncategoryid eşleşmedi.");
            res.redirect("/admin/category?action=error");
        }
        const name = req.body.name;
        await Category.update({ 
            name: name,
            url: slugField(name)
        }, {
            where: { id: categoryid }
        });
        res.redirect("/admin/category?action=edit&type=category");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_categories = async function(req, res){
    try {
        const categories = await Category.findAll();
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
}
