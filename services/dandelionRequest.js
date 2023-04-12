require("dotenv").config();
const axios = require("axios");

const sendtoDandelion = async function (textOB) {
  let result = {
    originEnglishText: textOB.text1,
    optimizedEnglishText: textOB.text2,
  };

  text1 = encodeURIComponent(textOB.text1);
  text2 = encodeURIComponent(textOB.text2);
  console.log(text1);
  console.log(text2);
  await axios({
    url: `https://api.dandelion.eu/datatxt/sim/v1/?lang=en&text1=${text1}&text2=${text2}&token=${process.env.Dandelion_KEY}`,
    method: "GET",
    responseType: "application/json",
  })
    .then((res) => {
      console.log(JSON.parse(res.data));
      const resJson = JSON.parse(res.data);
      console.log(resJson.similarity);
      result.similarity = resJson.similarity;
    })
    .catch((err) => {
      console.log(err);
      result.similarity = 0;
    });
  return result;
};

module.exports = sendtoDandelion;
