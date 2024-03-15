const express = require("express");
const router = express.Router();

const isAuth = require("../middlewares/auth");
const authController = require("../controllers/auth");

router.get("/register", authController.get_reqister);

router.post("/register", authController.post_register);

router.get("/login", authController.get_login);

router.post("/login", authController.post_login);

router.get("/logout", authController.get_logout);

router.get("/user-list", isAuth, authController.get_user_list);

router.get("/delete/:id", isAuth, authController.get_user_delete);

router.post("/delete", isAuth, authController.post_user_delete);


module.exports = router;