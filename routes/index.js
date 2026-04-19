const express = require("express");
const router = express.Router();

const gainLossRouters = require("./gain-loss");
const userRouters = require("./user");
const setUpIntradayRouters = require("./set-up-intraday");
const getIntradayRouters = require("./get-intraday");
const tradeOneSightRouters = require("./trade-one-sight");

router.use("/api", gainLossRouters);
router.use("/api/user", userRouters);
router.use("/api/set-up-intraday", setUpIntradayRouters);
router.use("/api/get-intraday", getIntradayRouters);
router.use("/api/trade-one-sight", tradeOneSightRouters);

module.exports = router;
