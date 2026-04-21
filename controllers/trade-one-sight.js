const IntradayMaster = require("../modals/IntradayMaster");
const {
  ListBasedOnEachCandle,
} = require("../services/Algorithms/ListBasedOnEachCandle.");

const initialDraft = async (req, res) => {
  try {
    const { date } = req.params;

    const intraday_data = await IntradayMaster.find({ date }).lean();

    if (intraday_data?.length <= 0) {
      res.status(200).json(intraday_data);
    }

    const sort = intraday_data.sort((a, b) => {
      const hourDiff = Number(a.hour) - Number(b.hour);

      if (hourDiff !== 0) {
        return hourDiff; // sort by hour first
      }

      return Number(a.minute) - Number(b.minute); // if same hour, sort by minute
    });

    const last_intraday_postiion = sort[sort?.length - 1];

    const ListBasedOnEachCandleInstance = new ListBasedOnEachCandle();

    const candleDetails = ListBasedOnEachCandleInstance.list_and_sort(
      last_intraday_postiion,
    );

    res.status(200).json(candleDetails);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const initialDraftChart = async (req, res) => {
  try {
    const { date } = req.params;

    const intraday_data = await IntradayMaster.find({ date }).lean();

    if (intraday_data?.length <= 0) {
      res.status(200).json(intraday_data);
    }

    const sort = intraday_data.sort((a, b) => {
      const hourDiff = Number(a.hour) - Number(b.hour);

      if (hourDiff !== 0) {
        return hourDiff; // sort by hour first
      }

      return Number(a.minute) - Number(b.minute); // if same hour, sort by minute
    });

    const last_intraday_postiion = sort[sort?.length - 1];

    const ListBasedOnEachCandleInstance = new ListBasedOnEachCandle();

    const candleDetails = ListBasedOnEachCandleInstance.list_and_chart(
      last_intraday_postiion,
    );

    res.status(200).json(candleDetails);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = {
  initialDraft,
  initialDraftChart,
};
