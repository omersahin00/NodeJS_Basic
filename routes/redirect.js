const express = require("express");
const router = express.Router();

const redirectController = require("../controllers/redirect");

// Routers:
router.get("/:token", redirectController.redirect_to_url);

module.exports = router;