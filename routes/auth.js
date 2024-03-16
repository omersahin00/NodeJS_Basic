const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// Middlewares:
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

// Routers:
router.get("/register", csrf, authController.get_reqister);
router.post("/register", authController.post_register);

router.get("/login", csrf, authController.get_login);
router.post("/login", csrf, authController.post_login);

router.get("/logout", csrf, authController.get_logout);

router.get("/user-list", isAuth, authController.get_user_list);

router.get("/delete/:id",isAuth, csrf, authController.get_user_delete);
router.post("/delete", isAuth, authController.post_user_delete);

router.get("/reset-password", csrf, authController.get_reset_password);
router.post("/reset-password", csrf, authController.post_reset_password);

router.get("/new-password/:token", csrf, authController.get_new_password);
router.post("/new-password", csrf, authController.post_new_password);


module.exports = router;