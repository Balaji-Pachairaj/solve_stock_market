const express = require("express");
const router = express.Router();

const tradeOneSightControllers = require("../controllers/trade-one-sight");

router.get("/initialDraft-v1/:date", tradeOneSightControllers.initialDraft);

module.exports = router;
