const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const adminRouter = require("./admin");
const authRouter = require("./auth");
const redirectRouter = require("./redirect");
const gameRouter = require("./game");

router.use("/admin", adminRouter);
router.use("/account", authRouter);
router.use(userRouter);
router.use("/r", redirectRouter);
router.use(gameRouter);

module.exports = router;