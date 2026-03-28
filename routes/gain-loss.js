const express = require("express");
const router = express.Router();

const gainLossControllers = require("../controllers/gain-loss");

router.get("/gain-loss-v1/:date", gainLossControllers.gainLossV1);

module.exports = router;
