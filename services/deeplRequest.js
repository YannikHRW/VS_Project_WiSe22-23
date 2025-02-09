require("dotenv").config();
const axios = require("axios");

/**
 * send deepl request
 * @param {Object} textOB {lang: "EN/DE", text: "text"}
 * @returns deepl api response filtered text. Error msg in case api sends error
 */
const sendtoDeepL = async function (textOB) {
  const res = await fetchAPI(textOB);
  if (res.status === 200) {
    return res.data.translations[0].text;
  } else {
    return `Error: Deepl-API responded with a ${res.status} Code.`;
  }
};

/**
 * fetch deepl api
 * @returns response
 */
const fetchAPI = async (textOB) => {
  return await axios
    .post(
      `https://api-free.deepl.com/v2/translate?auth_key=${
        process.env.DEEPL_KEY
      }&text=${encodeURIComponent(textOB.text)}&target_lang=${textOB.lang}`
    )
    .catch((err) => {
      console.log(err);
      return err.response;
    });
};

module.exports = sendtoDeepL;
