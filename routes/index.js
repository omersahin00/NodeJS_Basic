const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const adminRouter = require("./admin");
const authRouter = require("./auth");
const redirectRouter = require("./redirect");

router.use("/admin", adminRouter);
router.use("/account", authRouter);
router.use(userRouter);
router.use("/r", redirectRouter);

module.exports = router;