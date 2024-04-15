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
            return res.redirect("/r/short-url-create");
        }

        console.log("\nRedirect in: ", token, "\nRedirect to: ", redirect.url, "\n");

        return res.redirect(redirect.url);
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_create_redirect_url = async (req, res) => {
    const message = req.session.message;
    const shortUrl = req.session.shortUrl;
    delete req.session.message;
    delete req.session.shortUrl;

    try {
        return res.render("redirect/link-create", {
            title: "Create Short URL",
            message: message,
            shortUrl: shortUrl,
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
            shortUrl += ":" + config.port;
        }
        else if (config.platform == "public") {
            var address = config.address.public
        }
        
        address += "/r/";

        req.session.shortUrl = address + token;
        
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
        const message = req.session.message;
        delete req.session.message;

        if (!redirects) {
            req.session.message = Message("Linkler alnırken bir sorun oluştu!", "danger");
            return res.redirect("/r/short-url-create");
        }

        if (config.platform == "local") {
            var shortUrl = config.address.local
            shortUrl += ":" + config.port;
        }
        else if (config.platform == "public") {
            var shortUrl = config.address.public
        }

        shortUrl += "/r/";

        redirects.forEach(redirect => {
            redirect.shortUrl = shortUrl + redirect.token;
        });

        return res.render("redirect/link-list", {
            title: "Link List",
            redirects: redirects,
            message: message
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_short_url_delete = async(req, res) => {
    try {
        const token = req.params.token;
        
        if (!token) {
            req.session.message = Message("Token alınamadı!", "danger");
            return res.redirect("/r/short-url-list");
        }
        
        await Redirect.destroy({
            where: {
                token: token
            }
        });

        return res.redirect("/r/short-url-list");
    }
    catch (error) {
        console.log(error);
    }
}

exports.get_short_url_delete_all = async(req, res) => {
    try {
        return res.render("redirect/link-delete", {
            title: "Delete All Link"
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.post_short_url_delete_all = async(req, res) => {
    try {
        await Redirect.destroy({
            where: {}
        });
        return res.redirect("/r/short-url-list");
    }
    catch (error) {
        console.log(error);
    }
}