const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");

const adminController = require("../controllers/admin");


router.get("/blogs/delete/:blogid", adminController.get_blog_delete);

router.post("/blogs/delete/:blogid", adminController.post_blog_delete);

router.get("/blogs/create", adminController.get_blog_create);

router.post("/blogs/create", imageUpload.upload.single("resim"), adminController.post_blog_create);

router.get("/blogs/:blogid", adminController.get_blog_edit);

router.post("/blogs/:blogid", imageUpload.upload.single("resim"), adminController.post_blog_edit);

router.get("/blogs", adminController.get_blogs);



router.get("/category/delete/:categoryid", adminController.get_category_delete);

router.post("/category/delete/:categoryid", adminController.post_category_delete);

router.get("/category/create", adminController.get_category_create);

router.post("/category/create", adminController.post_category_create);

router.get("/category/:categoryid", adminController.get_category_edit);

router.post("/category/:categoryid", adminController.post_categoy_edit);

router.get("/category", adminController.get_categories);


module.exports = router;