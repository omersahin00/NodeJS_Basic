const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");

const fs = require("fs");
const sequelize = require("../data/db");
const config = require("../config");
const { Op } = require("sequelize");
const slugField = require("../helpers/slugfield");
const emailService = require("../helpers/send-mail");
const Message = require("../helpers/message-manager");


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
        await Category.create({ 
            name: newCategory,
            url: slugField(newCategory)
        });
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



exports.get_roles = async function(req, res) {
    try {
        const roles = await Role.findAll({
            attributes: {
                include: [
                    'role.id', 
                    'role.rolename', 
                    [sequelize.fn('COUNT', sequelize.col('users.id')), 'user_count']
                ]
            },
            include: [
                { model: User, attributes: ['id'] }
            ],
            group: ['role.id'],
            raw: true,
            includeIgnoreAttributes: false
        });

        return res.render("admin/role-list", {
            title: "Role List",
            roles: roles
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_role_edit = async function(req, res) {
    const roleid = req.params.roleid;
    try {
        const role = await Role.findByPk(roleid);
        const users = await role.getUsers();
        if (role) {
            return res.render("admin/role-edit", {
                title: "Role Edit",
                role: role,
                users: users
            });
        }
        return res.redirect("admin/roles");
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_role_edit = async function(req, res) {
    const roleid = req.body.roleid;
    const rolename = req.body.rolename;

    try {
        await Role.update({
            rolename: rolename
        }, {
            where: { id: roleid }
        });
        return res.redirect("/admin/roles");
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_role_remove = async function(req, res) {
    const userid = req.body.userid;
    const roleid = req.body.roleid;
    
    try {
        await sequelize.query(`delete from userRoles where userId = ${userid} and roleId = ${roleid}`);
        return res.redirect("/admin/roles/" + roleid);
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_user_list = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        const users = await User.findAll({
            include: { model: Role }
        });
        return res.render("admin/user-list", {
            title: "User List",
            users: users,
            message: message
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_user_delete = async function(req, res) {
    try {
        // console.log("\n\n\n" + "Buraya girdi" + "\n\n\n");
        const userid = req.params.id;
        const user = await User.findOne({ where: { id: userid }});

        return res.render("admin/user-delete", {
            title: "User Delete",
            user: user
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_user_delete = async function(req, res) {
    const id = req.body.userid;

    try {
        const email = req.session.email;
        if (!email) {
            // oturum bulunamadı
            console.log("\n\n" + "Kullanıcı oturumu algılanamadı. Tekrar giriş yapmaya yönelndiriliyor." + "\n\n");
            return res.redirect("/account/logout");
        }
        
        const nowUser = await User.findOne({ where: { email: email }});
        if (nowUser.id == id) {
            // kendisini silmeye çalıştı
            req.session.message = Message("Kendinizi silemezsiniz!", "warning");
            return res.redirect("/admin/user-list");
        }

        // silme işlemi gerçekleştirilecek:
        const deletedUser = await User.findOne({
            where: { id: id }, 
            attributes: [ "email" ]
        });

        await User.destroy({
            where: { id: id }
        });

        emailService.sendMail({
            from: config.email.from,
            to: deletedUser.email,
            subject: "Hesabınız silindi.",
            text: "Hesabınız tamamen silinmiştir."
        });        

        req.session.message = Message(`Kullanıcı silindi (${deletedUser.email})`, "success")
        return res.redirect("/admin/user-list");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_user_edit = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;

    const userid = req.params.id;

    try {
        // const user = await User.findByPk(userid);
        const user = await User.findOne({
            where: { id: userid },
            include: { model: Role, attributes: ["id"] }
        });

        const roles = await Role.findAll();

        if (!user || !roles) {
            req.session.message = Message("Bilgiler yüklenirken bir hata oluştu!", "danger");
            return res.redirect("/admin/user-list");
        }

        return res.render("admin/user-edit", {
            title: "User Edit",
            user: user,
            roles: roles
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_user_edit = async function(req, res) {
    const userid = req.body.userid;
    const fullname = req.body.fullname
    const email = req.body.email;
    var roleIds = [];

    if (typeof req.body.roles == Object){
        roleIds = req.body.roles;
    }
    else {
        console.log("\n\n" + "Buraya girdi" + "\n\n");
        for (let i = 0; i < req.body.roles.length; i++) {
            roleIds[i] = req.body.roles[i];
        }
    }
    
    try {
        const user = await User.findOne({
            where: { id :userid },  
            include: { model: Role, attributes: ["id"] }
        });

        if (!user) {
            req.session.message = Message("Bilgiler yüklenirken bir hata oluştu!", "danger");
            return res.redirect("/admin/user-list");
        }

        user.fullname = fullname;
        user.email = email;

        if (roleIds == undefined) {
            await user.removeRoles(user.roles);
        } 
        else {
            await user.removeRoles(user.roles);
            const selectedRoles = await Role.findAll({
                where: {
                    id: {
                        [Op.in]: roleIds
                    }
                }
            });
            await user.addRoles(selectedRoles);
        }
        
        await user.save();
        return res.redirect("/admin/user-list");
    }
    catch(error) {
        console.log(error);
    }
}