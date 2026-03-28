const express = require("express");
const router = express.Router();

const gainLossControllers = require("../controllers/gain-loss");

router.get("/gain-loss-v1/:date", gainLossControllers.gainLossV1);
router.get("/gain-loss-cron-v1", gainLossControllers.gainLossCronV1);

module.exports = router;
