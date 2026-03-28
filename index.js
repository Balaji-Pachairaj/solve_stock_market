const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const API_ROUTES = require("./routes/index");

app.use(express.json());

app.use("/", API_ROUTES);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
