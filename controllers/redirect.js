const Redirect = require("../models/redirect");
const sequelize = require("../data/db");
const generateShortToken = require("../helpers/short-url-generator");


exports.redirect_to_url = async (req, res) => {
    const token = req.params.token;

    const redirect = await Redirect.findOne({
        where: {
            id: 1
        },
        raw: true
    });
    
    if (!redirect || !redirect.url) {
        res.redirect("/");
    }
    
    res.redirect(redirect.url);
}
