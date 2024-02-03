const express = require("express");
const router = express.Router();

const db = require("../data/db");


const data = {
    title: "Popüler Kurslar",
    categories: ["Web Geliştirme", "Programlama", "Mobil Uygulamalar", "Veri Analizi"],
    blogs: [
        {
            blogid: 1,
            baslik: "Komple Uygulamalı Web Geliştirme",
            aciklama: "Sıfırdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
            resim: "1.jpeg",
            anasayfa: true,
            onay: true
        },
        {
            blogid: 2,
            baslik: "Python ile Sıfırdan İleri Seviye Python Programlama",
            aciklama: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
            resim: "2.jpeg",
            anasayfa: true,
            onay: false
        },
        {
            blogid: 3,
            baslik: "Sıfırdan İleri Seviye Modern Javascript Dersleri ES7+",
            aciklama: "Modern javascript dersleri ile (ES6 & ES7+) Nodejs, Angular, React ve VueJs için sağlam bir temel oluşturun.",
            resim: "3.jpeg",
            anasayfa: false,
            onay: false
        },
        {
            blogid: 4,
            baslik: "Sıfırdan Uygulamalı React Geliştirme: Hooks, Redux & Firebase",
            aciklama: "En popüler frontend kütüphanesi React'i baştan sona uygulamalı projelerle öğren. Hooks, Redux, Webpack, Firebase ve Fazlası.",
            resim: "4.jpeg",
            anasayfa: false,
            onay: true
        }
    ]
}

router.use("/blogs/:blogid", function(req, res){
    res.render("users/blog-details");
});

router.use("/blogs", function(req, res){
    res.render("users/blogs", data);
});

router.use("/", function(req, res){
    db.execute("select * from Blog where anasayfa = 1")
        .then(result => {
            let blogs = result[0];
            res.render("users/index", {
                title: blogs.title,
                blogs: blogs,
                categories: data.categories, // Veri tabanında olmadığı için geçiçi olarak diziden çekildi.
                anasayfa: blogs.anasayfa,
                onay: blogs.onay
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;
