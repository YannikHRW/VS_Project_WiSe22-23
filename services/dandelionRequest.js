require("dotenv").config();
const axios = require("axios");

/**
 * send dandelion request
 * @param {Object} textOB {text1: "...", text2: "...", syntacticMode: "" / "bow=always&"}
 * @returns dandelion api response delta with both texts. Error msg in case api sends error
 */
const sendtoDandelion = async function (textOB) {
  const res = await fetchAPI(textOB);
  let result = {
    originEnglishText: textOB.text1,
    optimizedEnglishText: textOB.text2,
  };
  if (res.status === 200) {
    result.similarity = res.data.similarity;
    return result;
  } else {
    result.similarity = `Error: Dandelion-API responded with a ${res.status} Code.`;
    return result;
  }
};
/**
 * fetch deepl api
 * @returns response
 */
const fetchAPI = async (textOB) => {
  return await axios
    .get(
      `https://api.dandelion.eu/datatxt/sim/v1/?lang=en&${
        textOB.syntacticMode
      }text1=${encodeURIComponent(textOB.text1)}&text2=${encodeURIComponent(
        textOB.text2
      )}&token=${process.env.Dandelion_KEY}`
    )
    .catch((err) => {
      console.log(err);
      return err.response;
    });
};

module.exports = sendtoDandelion;
