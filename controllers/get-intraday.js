const IntradayMaster = require("../modals/IntradayMaster");

const getIntraday = async (req, res) => {
  try {
    const { date } = req.params;

    const intraday_data = await IntradayMaster.find({
      date,
    });

    const sort = intraday_data.sort((a, b) => {
      const hourDiff = Number(a.hour) - Number(b.hour);

      if (hourDiff !== 0) {
        return hourDiff; // sort by hour first
      }

      return Number(a.minute) - Number(b.minute); // if same hour, sort by minute
    });

    res.status(200).json(intraday_data);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  getIntraday,
};
