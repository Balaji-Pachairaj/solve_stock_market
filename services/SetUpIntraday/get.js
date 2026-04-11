const IntradayMaster = require("../../modals/IntradayMaster");

const getIntradayData = async (dateOfFetch, hour, min) => {
  try {
    const data = await IntradayMaster.find({
      minute: min,
      hour: hour,
      date: dateOfFetch,
    });

    
    if (data.length > 0) {
      return data[0];
    }

    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getIntradayData,
};
