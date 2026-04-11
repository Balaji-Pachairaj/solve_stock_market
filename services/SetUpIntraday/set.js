const { GetIntradayData } = require("../yahoo/getHistoricData");

const setIntradayData = async (dateOfFetch, hour, min) => {
  try {
    const GetIntradayDataInstance = new GetIntradayData();

    // Get current IST time safely
    // const now = new Date(dateOfFetch);

    // const nowIST = new Date(
    //   now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    // );

    // // Extract IST parts (important fix)
    // const year = nowIST.getFullYear();
    // const month = nowIST.getMonth();
    // const day = nowIST.getDate();

    // // Create FROM (9:15 IST)
    // const from = new Date(year, month, day, 9, 15 , 0, 0);
    // // 9:15 IST → 03:45 UTC

    // // Create TO (dynamic IST)
    // const to = new Date(year, month, day, hour, min ,0, 0);

    const nowIST = new Date(
      new Date(dateOfFetch).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );

    // Set 09:15 IST
    const from = new Date(nowIST);
    from.setHours(9, 15, 0, 0);

    // Current IST time
    const to = new Date(nowIST);
    to.setHours(Number(hour), Number(min), 0, 0);

    console.log("FROM:", from.toISOString());
    console.log("TO:", to.toISOString());

    const data = await GetIntradayDataInstance.getTop500(from, to);

    let sort = data.sort((a, b) => b.percentage - a.percentage);

    sort = sort.map((item, index) => {
      return { ...item, rank: index + 1 };
    });

    return sort;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  setIntradayData,
};
