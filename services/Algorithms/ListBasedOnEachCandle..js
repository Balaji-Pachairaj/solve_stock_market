function formatWithIST(dateString) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type).value;

  return `${get("day")}-${get("month")}-${get("year")}-${get("hour")}-${get("minute")}`;
}

class ListBasedOnEachCandle {
  list_and_sort(last_intraday_postiion) {
    const candleWiseObject = {};

    // Candle Wise Putting
    for (const stock of last_intraday_postiion?.data) {
      const stockName = stock?.name;
      const stockSymbol = stock?.symbol;

      // Loop the candles - 5M
      for (const candle of stock?.intradayCandles) {
        const date = candle?.date;

        const dateString = formatWithIST(date);

        if (Array.isArray(candleWiseObject[dateString])) {
          // Existing
          candleWiseObject[dateString]?.push({
            stockName,
            stockSymbol,
            percentage: this.getPercentageChange(candle),
            ...candle,
          });
        } else {
          // Not created
          candleWiseObject[dateString] = [];
          candleWiseObject[dateString]?.push({
            stockName,
            stockSymbol,
            percentage: this.getPercentageChange(candle),
            ...candle,
          });
        }
      }

      // -----------------------------------
    }

    const sortCandleObject = {};

    for (const [time, stocks] of Object.entries(candleWiseObject)) {
      const sorted = stocks.sort((a, b) => b.percentage - a.percentage);
      sortCandleObject[time] = sorted;
    }

    return sortCandleObject;
  }

  getPercentageChange(candle) {
    const { open, close } = candle;

    if (open === 0) return 0; // avoid division by zero

    const change = ((close - open) / open) * 100;

    return Number(change.toFixed(2)); // rounded to 2 decimals
  }

  list_and_chart(last_intraday_postiion) {
    let candleBar = [];
    let yAxis = [];

    // Candle Wise Putting
    for (const stock of last_intraday_postiion?.data) {
      let stock_list = [];
      const stockName = stock?.name;
      const stockSymbol = stock?.symbol;

      yAxis = [];

      // Loop the candles - 5M
      for (const candle of stock?.intradayCandles) {
        const date = candle?.date;

        const dateString = this.getMMHH(date);
        yAxis.push(dateString);
        const percentageChange = this.getPercentageChange(candle);
        stock_list.push({
          percentage: percentageChange,
          dateString,
        });
      }

      candleBar.push({
        stockName,
        stockSymbol,
        stock_list,
      });
    }

    return {
      candleBar,
      yAxis,
    };
  }

  getMMHH(dateString) {
    const date = new Date(dateString);

    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type).value;

    return `${get("hour")}-${get("minute")}`;
  }
}

module.exports = {
  ListBasedOnEachCandle,
};
