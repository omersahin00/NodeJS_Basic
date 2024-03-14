module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
       return res.redirect("/account/Login" + "?returnUrl=" + req.originalUrl);
    }
    next();
}
