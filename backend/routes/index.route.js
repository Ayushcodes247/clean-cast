const express = require("express");
const router = express.Router();
const facebook = require("./facebook/index.route");
const users = require("./user/index.route");

router.use("/auth", facebook);
router.use("/users", users);

module.exports = router;