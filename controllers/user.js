const Blog = require("../models/blog");
const Category = require("../models/category");
const { Op } = require("sequelize");

exports.blog_by_category = async function(req, res) {
    try {
        const categoryId = req.params.categoryId;
        const blogs = await Blog.findAll({
            where: { categoryId: categoryId }
        });
        const categories = await Category.findAll();
        
        if (blogs) {
            id = parseInt(categoryId);
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
}

exports.blog_details = async function(req, res){
    try {
        const blogID = req.params.blogid;
        blogs = await Blog.findAll({
            where: {id: blogID}
        });
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
}

exports.blog_list = async function(req, res){
    try {
        const blogs = await Blog.findAll({
            where: { onay: true }
        });
        const categories = await Category.findAll();

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
}

exports.index = async function(req, res){
    try {
        const blogs = await Blog.findAll({
            where: { 
                [Op.and]: [
                    { anasayfa: true },
                    { onay: true }
                ]
            },
            raw: true
        });
        const categories = await Category.findAll();

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
}
