const { setIntradayData } = require("../services/SetUpIntraday/set");
const IntradayMaster = require("../modals/IntradayMaster");
const { getIntradayData } = require("../services/SetUpIntraday/get");

const setIntraday = async (req, res) => {
  try {
    const body = req.body;
    const { get_response = false } = req.query;

    // check whether data is already exist
    const existingDBCheck = await getIntradayData(
      body.date,
      body.hour,
      body.minute,
    );

    let DB_data = null;
    if (existingDBCheck) {
      DB_data = existingDBCheck;
    } else {
      const intradayData = await setIntradayData(
        body.date,
        body.hour,
        body.minute,
      );

      const saveInDB = new IntradayMaster({
        minute: body.minute,
        hour: body.hour,
        date: body.date,
        data: intradayData,
      });

      await saveInDB.save();

      DB_data = saveInDB;
    }

    if (get_response) {
      res.status(201).json(DB_data);
    } else {
      res.status(201).json("Done");
    }
  } catch (er) {
    console.log(er);
    res.status(400).json("Failed");
  }
};

module.exports = {
  setIntraday,
};
