const express = require("express");
const router = express.Router();

const setUpIntradayControllers = require("../controllers/set-up-intraday");

router.post("/set", setUpIntradayControllers.setIntraday);

module.exports = router;
