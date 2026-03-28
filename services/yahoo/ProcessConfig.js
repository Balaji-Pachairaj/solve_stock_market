const fs = require("fs");

class ProcessConfig {
  getSymbolsTop500Companies() {
    const rawData = fs.readFileSync(
      "config/Yahoo/Top500Companies.json",
      "utf-8",
    );
    const data = JSON.parse(rawData);

    const listOfCompanies = data.data;

    const symbols = listOfCompanies
      .filter((stock) => stock.symbol !== "NIFTY 500") // remove index
      .map((stock) => `${stock.symbol}.NS`);

    return symbols;
  }
}

module.exports = {
  ProcessConfig,
};
