const Redirect = require("../models/redirect");
const sequelize = require("../data/db");
const Message = require("../helpers/message-manager");
const config = require("../config");
const generateShortToken = require("../helpers/short-url-generator");


exports.get_redirect_to_url = async (req, res) => {
    const token = req.params.token;

    try {
        const redirect = await Redirect.findOne({
            where: {
                token: token
            },
            raw: true
        });

        if (!redirect || !redirect.url) {
            return res.redirect("/");
        }
        
        return res.redirect(redirect.url);
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_create_redirect_url = async (req, res) => {
    const message = req.session.message;
    delete req.session.message;

    try {
        return res.render("redirect/create-shorturl", {
            title: "Create Short Url",
            message: message
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_create_redirect_url = async (req, res) => {
    try {
        const url = req.body.url;
        const token = await generateShortToken(6);
        
        await Redirect.create({
            token: token,
            url: url
        });

        req.session.message = Message(`Kısa url başarıyla oluşturuldu:  ${config.address.local}r/${token}`, "success");
        return res.redirect("/r/short-url-create");
    }
    catch (error) {
        console.log(error);
        req.session.message = Message("Bir hata oluştu!", "danger");
    }
}