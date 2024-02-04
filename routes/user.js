const express = require("express");
const router = express.Router();

const db = require("../data/db");


const data = {
    title: "Popüler Kurslar",
    //categories: ["Web Geliştirme", "Programlama", "Mobil Uygulamalar", "Veri Analizi"],
    // blogs: Veri tabanından çekiliyor.
}

router.use("/blogs/:blogid", function(req, res){
    res.render("users/blog-details");
});

router.use("/blogs", function(req, res){
    db.execute("select * from Blog where onay = 1")
        .then(result => {
            let blogs = result[0];
            db.execute("select * from Category")
                .then(result2 => {
                    let categories = result2[0];
                    res.render("users/blogs", {
                        title: "Popüler Kurslar",
                        blogs: blogs,
                        categories: categories,
                        anasayfa: blogs.anasayfa,
                        onay: blogs.onay
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.use("/", function(req, res){
    db.execute("select * from Blog where anasayfa = 1 AND onay = 1")
        .then(result => {
            let blogs = result[0];
            db.execute("select * from Category")
                .then(result2 => {
                    let categories = result2[0];
                    console.log(categories);
                    res.render("users/index", {
                        title: "Popüler Kurslar", 
                        blogs: blogs,
                        categories: categories,
                        anasayfa: blogs.anasayfa,
                        onay: blogs.onay
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

module.exports = router;
