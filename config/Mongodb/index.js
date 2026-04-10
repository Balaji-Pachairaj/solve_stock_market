const mongoose = require("mongoose");

const connectDB = async (call_back_fn) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_STRING, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    call_back_fn();
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
