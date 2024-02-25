const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/blogs/category/:categoryId", userController.blog_by_category);

router.get("/blogs/:blogid", userController.blog_details);

router.get("/blogs", userController.blog_list);

router.get("/", userController.index);

module.exports = router;