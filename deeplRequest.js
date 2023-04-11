require("dotenv").config();
const axios = require("axios");

const sendtoDeepL = async function (text) {
  //console.log(text);
  text = encodeURIComponent(text)
  let result;
  await axios({
    url: `https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_KEY}&text=${text}&target_lang=DE`,
    method: "POST",
    responseType: "application/json",
  }).then((res) => {
    //console.log(JSON.parse(res.data));
    const a = JSON.parse(res.data)
    result = a.translations[0].text;
  });
  return result;
};

module.exports = sendtoDeepL;