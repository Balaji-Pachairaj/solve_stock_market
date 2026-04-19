const IntradayMaster = require("../modals/IntradayMaster");
const {
  CalculateRankDifference,
} = require("../services/Algorithms/CalculateRankDifference");

const getIntraday = async (req, res) => {
  try {
    const { date } = req.params;

    const intraday_data = await IntradayMaster.find({ date }).lean();

    const sort = intraday_data.sort((a, b) => {
      const hourDiff = Number(a.hour) - Number(b.hour);

      if (hourDiff !== 0) {
        return hourDiff; // sort by hour first
      }

      return Number(a.minute) - Number(b.minute); // if same hour, sort by minute
    });

    const CalculateRankDifferenceInstance = new CalculateRankDifference();

    const calculateRank = CalculateRankDifferenceInstance.calculate(sort);

    res.status(200).json(calculateRank);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  getIntraday,
};
