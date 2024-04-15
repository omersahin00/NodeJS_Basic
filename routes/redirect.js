const express = require("express");
const router = express.Router();

const redirectController = require("../controllers/redirect");

// Middlewares:
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

// Routers:
router.get("/short-url-list", isAuth, redirectController.get_short_url_list);

router.get("/short-url-create", csrf, redirectController.get_create_redirect_url);

router.post("/short-url-create", csrf, redirectController.post_create_redirect_url);

router.get("/:token", redirectController.get_redirect_to_url);

module.exports = router;