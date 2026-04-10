const express = require("express");
const router = express.Router();

const User = require("../modals/user");

router.get("/add-user", async (req, res) => {
  const user = new User({
    name: "Balaji",
    email: "balaji@test.com",
  });

  await user.save();
  res.send("User saved!");
});

module.exports = router;