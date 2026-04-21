class CalculateRankDifference {
  calculate(intraday) {
    const len = intraday.length;

    if (len <= 1) {
      return intraday;
    }

    const rankObject = [];

    for (const intra of intraday) {
      const current_rank = {};

      for (const current_stock of intra?.data) {
        if (current_rank[current_stock?.symbol]) {
          // Already Exist
        } else {
          // Not yet Added
          current_rank[current_stock.symbol] = current_stock?.rank;
        }
      }

      rankObject.push(current_rank);
    }

    const return_data = [];
    return_data?.push(intraday[0]);
    for (let i = 1; i < intraday.length; i++) {
      let intra = intraday[i];
      let previous_rank = rankObject[i - 1];

      const data = [];
      for (const current_stock of intra?.data) {
        current_stock.previous_rank = previous_rank[current_stock.symbol];

        const datum = {
          ...current_stock,
          previous_rank: previous_rank[current_stock.symbol],
        };

        data.push(datum);
      }

      return_data.push({
        ...intra,
        data,
      });
    }

    return return_data;
  }
}

module.exports = {
  CalculateRankDifference,
};
