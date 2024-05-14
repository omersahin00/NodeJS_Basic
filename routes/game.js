const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game");

// Routers:
router.get("/game", gameController.getGame);

module.exports = router;