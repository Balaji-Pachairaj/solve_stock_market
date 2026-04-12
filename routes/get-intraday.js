const express = require("express");
const router = express.Router();

const getIntradayControllers = require("../controllers/get-intraday");

router.get("/get/:date", getIntradayControllers.getIntraday);

module.exports = router;
