const { Companies } = require("../../config/Yahoo/Top500Companies");

class ProcessConfig {
  getSymbolsTop500Companies() {
    const rawData = Companies;

 

    const listOfCompanies = rawData.data;

    const symbols = listOfCompanies
      .filter((stock) => stock.symbol !== "NIFTY 500") // remove index
      .map((stock) => `${stock.symbol}.NS`);

    return symbols;
  }
}

module.exports = {
  ProcessConfig,
};
