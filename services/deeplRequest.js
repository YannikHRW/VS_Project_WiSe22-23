require("dotenv").config();
const axios = require("axios");

const sendtoDeepL = async function (textOB) {
  text = encodeURIComponent(textOB.text);
  let result = "";
  await axios({
    url: `https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_KEY}&text=${text}&target_lang=${textOB.lang}`,
    method: "POST",
    responseType: "application/json",
  })
    .then((res) => {
      const data = JSON.parse(res.data);
      result = data.translations[0].text;
    })
    .catch((err) => {
      console.log(err);
    });
  return result;
};

module.exports = sendtoDeepL;
