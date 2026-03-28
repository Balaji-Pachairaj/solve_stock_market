const { GetHistroicData } = require("../services/yahoo/getHistoricData");
const { OPEN_AI_CHAT } = require("../services/openai/chat");

const gainLossV1 = async (req, res) => {
  const { date } = req.params;

  const GetHistroicDataInstance = new GetHistroicData();

  const response = await GetHistroicDataInstance.getTop500Companies(date);

  const sortBasedOnPercent = response.sort(
    (a, b) => a.percentage - b.percentage,
  );

  const getTopThreeGainers = sortBasedOnPercent.slice(0, 3);
  const getTopThreeLoser = sortBasedOnPercent.slice(
    sortBasedOnPercent.length - 3,
    sortBasedOnPercent.length,
  );

  const OPEN_AI_CHAT_INSTANCE = new OPEN_AI_CHAT();

  const summary = await OPEN_AI_CHAT_INSTANCE.getSummaryTopGainerTopLoser(
    getTopThreeGainers,
    getTopThreeLoser,
  );

  res.json({
    summary,
    getTopThreeLoser,
    getTopThreeGainers,
    sortBasedOnPercent,
  });
};

module.exports = {
  gainLossV1,
};
