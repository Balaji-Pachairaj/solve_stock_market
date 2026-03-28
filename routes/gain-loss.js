const express = require("express");
const router = express.Router();

router.get("/gain-loss-v1/:date", (req, res) => {
  res.send("gain - loss - v1 hit");
});

module.exports = router;
