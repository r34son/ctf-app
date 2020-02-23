const router = require("express").Router();
const authController = require("./auth");
const taskController = require("./task");

router.use("/auth", authController);
router.use("/task", taskController);

module.exports = router;
