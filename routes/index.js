const express = require("express");
const router = express.Router();

const gainLossRouters = require("./gain-loss");
const userRouters = require("./user");

router.use("/api", gainLossRouters);
router.use("/api/user", userRouters);

module.exports = router;
