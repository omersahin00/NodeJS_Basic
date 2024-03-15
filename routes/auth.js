const express = require("express");
const router = express.Router();

// Middleware:
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

const authController = require("../controllers/auth");

router.get("/register", csrf, authController.get_reqister);
router.post("/register", authController.post_register);

router.get("/login", csrf, authController.get_login);
router.post("/login", authController.post_login);

router.get("/logout", csrf, authController.get_logout);

router.get("/user-list", isAuth, authController.get_user_list);

router.get("/delete/:id", csrf, isAuth, authController.get_user_delete);
router.post("/delete", isAuth, authController.post_user_delete);


module.exports = router;