const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const fileUpload = require("../helpers/file-upload");

// Middlewares:
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

const adminController = require("../controllers/admin");

// Routers:
router.get("/blogs/delete/:blogid", isAuth, csrf, adminController.get_blog_delete);

router.post("/blogs/delete/:blogid", isAuth, adminController.post_blog_delete);

router.get("/blogs/create", isAuth, csrf, adminController.get_blog_create);

router.post("/blogs/create", isAuth, imageUpload.upload.single("resim"), adminController.post_blog_create);

router.get("/blogs/:blogid", isAuth, csrf, adminController.get_blog_edit);

router.post("/blogs/:blogid", isAuth, imageUpload.upload.single("resim"), adminController.post_blog_edit);

router.get("/blogs", isAuth, adminController.get_blogs);


router.get("/category/delete/:categoryid", isAuth, csrf, adminController.get_category_delete);

router.post("/category/delete/:categoryid", isAuth, adminController.post_category_delete);

router.post("/category/remove", isAuth, csrf, adminController.post_category_remove);

router.get("/category/create", isAuth, csrf, adminController.get_category_create);

router.post("/category/create", isAuth, adminController.post_category_create);

router.get("/category/:categoryid", isAuth, csrf, adminController.get_category_edit);

router.post("/category/:categoryid", isAuth, adminController.post_categoy_edit);

router.get("/category", isAuth, adminController.get_categories);


router.get("/roles", isAuth, adminController.get_roles);

router.post("/roles/remove", isAuth, adminController.post_role_remove);

router.get("/roles/:roleid", isAuth, csrf, adminController.get_role_edit);

router.post("/roles/:roleid", isAuth, csrf, adminController.post_role_edit);

router.get("/user-list", isAuth, adminController.get_user_list);

router.get("/delete/:id",isAuth, csrf, adminController.get_user_delete);

router.post("/delete", isAuth, adminController.post_user_delete);

router.get("/user-edit/:id", isAuth, csrf, adminController.get_user_edit);

router.post("/user-edit", isAuth, csrf, adminController.post_user_edit);


router.get("/file-upload", isAuth, csrf, adminController.get_file_upload);

router.post("/file-upload", isAuth, fileUpload.upload.single("file"), adminController.post_file_upload);

module.exports = router;