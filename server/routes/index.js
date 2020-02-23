const router = require("express").Router();
const apiController = require("./api.js");

router.use("/api", apiController);

module.exports = router;
