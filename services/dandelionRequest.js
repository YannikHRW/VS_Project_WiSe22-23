require("dotenv").config();
const axios = require("axios");

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
    result.similarity = `Error: Deepl-API responded with a ${res.status} Code.`;
    return result;
  }
};

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
