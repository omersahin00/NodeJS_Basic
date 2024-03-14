const User = require("../models/user");
const bcrypt = require("bcrypt");
const Message = require("../helpers/message-manager");

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
        await User.create({
            fullname: name,
            email: email,
            password: hashedPassword
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
            message: message
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
