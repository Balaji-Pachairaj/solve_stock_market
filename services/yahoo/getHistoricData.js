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

    // const firstHourMovement = await this.getStockMovementFirstHour(
    //   symbol,
    //   date,
    // );

    return {
      symbol,
      name: quote.longName, // fallback (you can enrich later)
      movement: movement.toFixed(2),
      percentage: percentage.toFixed(2),
      // firstHour: firstHourMovement,
      close: latest.close,
      previousClose: prev.close,
      closeList: result.map((item) => item.close),
    };
  }

  async getTop500CompaniesFirstHour(date) {
    const ProcessConfigInstance = new ProcessConfig();

    const symbols = ProcessConfigInstance.getSymbolsTop500Companies();

    const results = [];

    const BATCH_SIZE = 100;

    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      const batch = symbols.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map((symbol) => this.getStockMovementFirstHour(symbol, date)),
      );

      results.push(...batchResults.filter(Boolean));

      await new Promise((res) => setTimeout(res, 1000)); // avoid rate limit
    }

    return results;
  }

  async getStockMovementFirstHour(symbol, date) {
    const yahooFinance = new YahooFinance();

    const marketOpen = new Date(`${date}T09:15:00+05:30`);
    const firstHourEnd = new Date(`${date}T09:30:00+05:30`);

    const quote = await yahooFinance.quote(symbol);

    const chart = await yahooFinance.chart(symbol, {
      period1: Math.floor(marketOpen.getTime() / 1000),
      period2: Math.floor(firstHourEnd.getTime() / 1000),
      interval: "5m",
    });

    // 🔥 Convert chart → historical-like format
    const result = (chart?.quotes || [])
      .filter((item) => item.open != null && item.close != null)
      .map((item) => ({
        date: new Date(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));

    // ✅ Now SAME as historical()
    if (!result || result.length === 0) return null;

    const first = result[0];
    const last = result[result.length - 1];

    if (!first || !last) return null;

    const movement = last.close - first.open;
    const percentage = (movement / first.open) * 100;

    // const thatDaysMovement = await this.getStockMovement(symbol, date);

    return {
      symbol,
      name: quote.longName,
      movement: movement.toFixed(2),
      percentage: percentage.toFixed(2),
      open: first.open,
      firstHourClose: last.close,
      // percentageInThatDay: thatDaysMovement.percentage,
      // closeList: result.map((item) => item.close),
    };
  }

  async getTop500CompaniesIntradayPeriod(from, to) {
    const ProcessConfigInstance = new ProcessConfig();

    const symbols = ProcessConfigInstance.getSymbolsTop500Companies();

    const results = [];

    const BATCH_SIZE = 20;

    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      const batch = symbols.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map((symbol) => this.getStockMovementIntraday(symbol, from, to)),
      );

      results.push(...batchResults.filter(Boolean));

      await new Promise((res) => setTimeout(res, 1000)); // avoid rate limit
    }

    return results;
  }

  async getStockMovementIntraday(symbol, from, to) {
    const yahooFinance = new YahooFinance();

    const marketOpen = new Date(from);
    const firstHourEnd = new Date(to);

    const quote = await yahooFinance.quote(symbol);

    const chart = await yahooFinance.chart(symbol, {
      period1: Math.floor(marketOpen.getTime() / 1000),
      period2: Math.floor(firstHourEnd.getTime() / 1000),
      interval: "5m",
    });

    // 🔥 Convert chart → historical-like format
    const result = (chart?.quotes || [])
      .filter((item) => item.open != null && item.close != null)
      .map((item) => ({
        date: new Date(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));

    // ✅ Now SAME as historical()
    if (!result || result.length === 0) return null;

    const first = result[0];
    const last = result[result.length - 1];

    if (!first || !last) return null;

    const movement = last.close - first.open;
    const percentage = (movement / first.open) * 100;

    // const thatDaysMovement = await this.getStockMovement(symbol, date);

    return {
      symbol,
      name: quote.longName,
      movement: movement.toFixed(2),
      percentage: percentage.toFixed(2),
      open: first.open,
      close: last.close,
      // percentageInThatDay: thatDaysMovement.percentage,
      // closeList: result.map((item) => item.close),
    };
  }
}
module.exports = {
  GetHistroicData,
};
