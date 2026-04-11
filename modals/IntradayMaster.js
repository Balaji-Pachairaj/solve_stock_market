const mongoose = require("mongoose");

const IntradayMaster = new mongoose.Schema({
  minute: {
    type: String,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // allows JSON object
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("IntradayMaster", IntradayMaster);
