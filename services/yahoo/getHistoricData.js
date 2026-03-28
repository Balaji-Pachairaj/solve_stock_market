const fs = require("fs");
const { ProcessConfig } = require("./ProcessConfig");
const YahooFinance = require("yahoo-finance2").default;

class GetHistroicData {
  async getTop500Companies(date) {
    const ProcessConfigInstance = new ProcessConfig();

    const symbols = ProcessConfigInstance.getSymbolsTop500Companies();

    const results = [];

    const BATCH_SIZE = 100;

    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      const batch = symbols.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map((symbol) => this.getStockMovement(symbol, date)),
      );

      results.push(...batchResults.filter(Boolean));

      await new Promise((res) => setTimeout(res, 1000)); // avoid rate limit
    }

    return results;
  }

  async getStockMovement(symbol, date) {
    const from = new Date(date);
    const to = new Date(date);
    to.setHours(23, 59, 59, 999);

    // Extend range to ensure we get previous trading day
    from.setDate(from.getDate() - 5);

    const yahooFinance = new YahooFinance();

    const quote = await yahooFinance.quote(symbol);

    const result = await yahooFinance.historical(symbol, {
      period1: from,
      period2: to,
      interval: "1d",
    });

    if (!result || result.length < 2) return null;

    const latest = result[result.length - 1];
    const prev = result[result.length - 2];

    const movement = latest.close - prev.close;
    const percentage = (movement / prev.close) * 100;

    return {
      symbol,
      name: quote.longName , // fallback (you can enrich later)
      movement: movement.toFixed(2),
      percentage: percentage.toFixed(2),
      close: latest.close,
      previousClose: prev.close,
      closeList : result.map(item => item.close)
    };
  }
}
module.exports = {
  GetHistroicData,
};
