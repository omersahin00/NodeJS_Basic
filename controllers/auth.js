const User = require("../models/user");
const bcrypt = require("bcrypt");
const Message = require("../helpers/message-manager");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");
const messageManager = require("../helpers/message-manager");
const { measureMemory } = require("vm");


exports.get_reqister = async function(req, res) {
    try {
        return res.render("auth/register", {
            title: "Register"
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_register = async function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.findOne({ where: { email: email }});
        if (user){
            req.session.message = Message("Girdiğiniz Email ile daha önce kayıt olunmuş!", "warning");
            return res.redirect("login");
        }
        const newUser = await User.create({
            fullname: name,
            email: email,
            password: hashedPassword
        });

        emailService.sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: "Hesabınız oluşturuldu.",
            text: "Hesabınız başarılı bir şekilde oluşturuldu."
        });

        req.session.message = Message("Hesabınız başarıyla oluşturuldu.", "success");
        return res.redirect("login");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_login = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/login", {
            title: "Login",
            message: message,
            csrfToken: req.csrfToken()
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_login = async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.render("auth/login", {
                title: "Login",
                message: Message("Email hatalı!", "danger")
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Login olduk.
            //res.cookie("isAuth", 1);
            req.session.isAuth = 1;
            req.session.fullname = user.fullname;
            req.session.email = user.email;
            const url = req.query.returnUrl || "/";
            return res.redirect(url);
        }
        
        return res.render("auth/login", {
            title: "Login",
            message: Message("Parola Hatalı!", "danger")
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_logout = async function(req, res) {
    try {
        await req.session.destroy();
        res.clearCookie("connect.sid");
        return res.redirect("/account/login");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_user_list = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        const users = await User.findAll();
        return res.render("auth/user-list", {
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

        return res.render("auth/user-delete", {
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
            return res.redirect("/account/user-list");
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
        return res.redirect("/account/user-list");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_reset_password = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/reset-password", {
            title: "Reset Password",
            message: message
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_reset_password = async function(req, res) {
    const email = req.body.email;

    try {
        const user = await User.findOne({ where: { email: email }});
        
        if (!user){
            req.session.message = Message("Email bulunamadı!", "danger");
            return res.redirect("reset-password");
        }

        var token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
        await user.save();

        await emailService.sendMail({
            from: config.email.from,
            to: email,
            subject: "Reset Password",
            html: `
                <p>Parolanızı güncellemek için aşağıdak linke tıklayın:</p>
                <p>
                    <a href="http:127.0.0.1:3000/account/new-password/${token}">Parola Sıfırla</a>
                </p>
            `
        })
        .then(() => {
            req.session.message = Message("Parola sıfırlama linki e-postanıza gönderildi.", "success");
            return res.redirect("login");
        })
        .catch((error) => {
            req.session.message = Message("E-posta gönderilirken bir hatayla karşılaşıldı!", "danger");
            return res.redirect("login");
        });       
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_new_password = async function(req, res) {
    const token = req.params.token;

    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now()
                }
            }
        });

        if (!user) {
            const message = Message("Parola sıfırlama süreniz dolmuş! Tekrardan talepte bulunun.", "danger");
            return res.render("auth/reset-password", {
                title: "Reset Password",
                message: message
            });
        }

        return res.render("auth/new-password", {
            title: "New Password",
            token: token,
            userId: user.id
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_new_password = async function(req, res) {
    const token = req.body.token;
    const userId = req.body.userId;
    const newPassword = req.body.password;

    try {
        const user = await User.findOne({
            where: {
                id: userId,
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now()
                }
            }
        });

        if (!user) {
            const message = Message("Parola sıfırlama süreniz dolmuş! Tekrardan talepte bulunun.", "danger");
            return res.render("auth/reset-password", {
                title: "Reset Password",
                message: message
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        req.session.message = Message("Parolanız değiştirildi!", "success");
        return res.redirect("login");
    }
    catch (error) {
        console.log(error);
    }
}