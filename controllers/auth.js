const User = require("../models/user");
const bcrypt = require("bcrypt");

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
        await User.create({
            fullname: name,
            email: email,
            password: hashedPassword
        });

        return res.redirect("login");
    }
    catch (error) {
        console.log(error);
    }
}


exports.get_login = async function(req, res) {
    try {
        return res.render("auth/login", {
            title: "Login",
            message: undefined
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
                message: "Email hatalı!"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Login olduk.
            res.cookie("isAuth", 1);
            return res.redirect("/");
        }
        
        return res.render("auth/login", {
            title: "Login",
            message: "Parola Hatalı!"
        });
    }
    catch (error) {
        console.log(error);
    }
}


exports.get_logout = async function(req, res) {
    try {
        res.clearCookie("isAuth");
        return res.redirect("/account/login");
    }
    catch (error) {
        console.log(error);
    }
}
