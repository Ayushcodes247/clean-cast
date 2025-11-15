const express = require("express");
const router = express.Router();
const auth = require("@routes/user/authentication/auth.route");
const images = require("@routes/user/images/index.route");

router.use("/" , auth);
router.use("/images", images);

module.exports = router;
