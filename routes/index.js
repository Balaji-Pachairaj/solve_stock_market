const express = require("express");
const router = express.Router();

const gainLossRouters = require("./gain-loss");

router.use("/api", gainLossRouters);

module.exports = router;
