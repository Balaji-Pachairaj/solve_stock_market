const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const cors = require("cors");


const API_ROUTES = require("./routes/index");
const connectDB = require("./config/Mongodb");

app.use(express.json());
app.use(cors({
  origin: "*", // allow all (for testing)
}));

app.use("/", API_ROUTES);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = 3000;

connectDB(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
