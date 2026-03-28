const { GetHistroicData } = require("../services/yahoo/getHistoricData");
const { OPEN_AI_CHAT } = require("../services/openai/chat");
const { SendGridSend } = require("../services/SendGrid/send");

const gainLossV1 = async (req, res) => {
  const { date } = req.params;

  const { get_summary = false, count = 3 } = req.query;

  const GetHistroicDataInstance = new GetHistroicData();

  const response = await GetHistroicDataInstance.getTop500Companies(date);

  const sortBasedOnPercent = response.sort(
    (a, b) => a.percentage - b.percentage,
  );

  const getTopThreeGainers = sortBasedOnPercent.slice(0, count);
  const getTopThreeLoser = sortBasedOnPercent.slice(
    sortBasedOnPercent.length - count,
    sortBasedOnPercent.length,
  );

  let summary = {};

  if (get_summary) {
    const OPEN_AI_CHAT_INSTANCE = new OPEN_AI_CHAT();

    summary = await OPEN_AI_CHAT_INSTANCE.getSummaryTopGainerTopLoser(
      getTopThreeGainers,
      getTopThreeLoser,
    );
  }

  res.json({
    summary,
    getTopThreeLoser,
    getTopThreeGainers,
    sortBasedOnPercent,
  });
};

const gainLossCronV1 = async (req, res) => {
  try {
    const { get_summary = false, count = 3 } = req.query;

    const GetHistroicDataInstance = new GetHistroicData();

    const today = new Date().toISOString().split("T")[0];
    const response = await GetHistroicDataInstance.getTop500Companies(today);

    const sortBasedOnPercent = response.sort(
      (a, b) => a.percentage - b.percentage,
    );

    const getTopThreeGainers = sortBasedOnPercent.slice(
      sortBasedOnPercent.length - count,
      sortBasedOnPercent.length,
    );
    const getTopThreeLoser = sortBasedOnPercent.slice(0, count);

    let summary = {};

    const OPEN_AI_CHAT_INSTANCE = new OPEN_AI_CHAT();
    if (get_summary) {
      summary = await OPEN_AI_CHAT_INSTANCE.getSummaryTopGainerTopLoser(
        getTopThreeGainers,
        getTopThreeLoser,
      );
    }

    const SendGridInstance = new SendGridSend();

    function cleanHTML(html) {
      return html
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();
    }

    const generatedHtmlContent =
      await OPEN_AI_CHAT_INSTANCE.generateEmailforStockSummary(today, {
        summary,
        getTopThreeLoser,
        getTopThreeGainers,
      });

    const emailResponse = await SendGridInstance.sendGainLoss(
      cleanHTML(generatedHtmlContent),
    );

    res.json({
      generatedHtmlContent: cleanHTML(generatedHtmlContent),
      today,
      summary,
      getTopThreeLoser,
      getTopThreeGainers,
      sortBasedOnPercent,
      emailResponse,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  gainLossV1,
  gainLossCronV1,
};
