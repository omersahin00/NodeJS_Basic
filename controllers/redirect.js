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
        let url = req.body.url;
        const token = await generateShortToken(6);
        
        if (!url.includes("www.")) {
            url = "www." + url;
        }

        if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = "https://" + url;
        }
        
        await Redirect.create({
            token: token,
            url: url
        });

        if (config.platform == "local") {
            var address = config.address.local
        }
        else if (config.platform == "public") {
            var address = config.address.public
        }

        req.session.message = Message(`Kısa url başarıyla oluşturuldu:  ${address}r/${token}`, "success");
        return res.redirect("/r/short-url-create");
    }
    catch (error) {
        console.log(error);
        req.session.message = Message("Bir hata oluştu!", "danger");
    }
}

exports.get_short_url_list = async (req, res) => {
    try {
        const redirects = await Redirect.findAll();
        if (!redirects) {
            req.session.message = Message("Linkler alnırken bir sorun oluştu!", "danger");
            return res.redirect("/r/short-url-create");
        }

        if (config.platform == "local") {
            var shortUrl = config.address.local
        }
        else if (config.platform == "public") {
            var shortUrl = config.address.public
        }

        redirects.forEach(redirect => {
            redirect.shortUrl = shortUrl + "r/" + redirect.token;
        });

        return res.render("redirect/link-list", {
            title: "Link List",
            redirects: redirects
        });
    }
    catch (error) {
        console.log(error);
    }
}