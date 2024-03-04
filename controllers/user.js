const Blog = require("../models/blog");
const Category = require("../models/category");
const { Op } = require("sequelize");

// exports.blog_by_category = async function(req, res) {
//     try {
//         const slug = req.params.slug;

//         const blogs = await Blog.findAll({
//             where: {
//                 onay: true
//             },
//             include: {
//                 model: Category,
//                 where: { url: slug }
//             }
//         });

//         const categories = await Category.findAll();
//         categoryName = categories.find(x => x.url == slug).name;

//         if (blogs && categories) {            

//             res.render("users/blogs", {
//                 selectedCategory: slug,
//                 title: categoryName,
//                 blogs: blogs,
//                 categories: categories,
//             });
//         }
//         else res.redirect("/");
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

exports.blog_details = async function(req, res){
    try {
        const slug = req.params.slug;
        blogs = await Blog.findAll({
            where: {
                url: slug
            }
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
        const size = 3;
        const { page = 0 } = req.query;
        const slug = req.params.slug;

        const blogs = await Blog.findAll({
            where: { onay: true },
            include: slug ? { model: Category, where: { url: slug } } : null,
            limit: size,
            offset: page * size,
        });
        const categories = await Category.findAll();

        res.render("users/blogs", {
            title: slug ? "Test" : "Populer Kurslar",
            blogs: blogs, 
            categories: categories,
            selectedCategory: slug ? slug : -1
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
