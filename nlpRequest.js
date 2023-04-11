require("dotenv").config();
const axios = require("axios");

const sendtoNLP = async function (inputText) {
  let resUrl = "";
  await axios({
    url: `https://api.nlpcloud.io/v1/gpu/async/finetuned-gpt-neox-20b/gs-correction`,
    method: "POST",
    headers: { Authorization: `Token ${process.env.NLP_KEY}` },
    data: { text: inputText },
  })
    .then((res) => {
      resUrl = res.data.url;
    })
    .catch((err) => console.log(err));
  return resUrl;
};

const sendtoNLPasync = async function (inputUrl) {
  let correctedContend = "";
  let status = 202;
  while (status === 202) {
    await axios({
      url: inputUrl,
      method: "GET",
      headers: { Authorization: `Token ${process.env.NLP_KEY}` },
    })
      .then((res) => {
        console.log(res.status);
        status = res.status;
      })
      .catch((err) => console.log(err));
  }
  await axios({
    url: inputUrl,
    method: "GET",
    headers: { Authorization: `Token ${process.env.NLP_KEY}` },
  })
    .then((res) => {
      const jsonContent = JSON.parse(res.data.content);
      correctedContend = jsonContent.correction;
    })
    .catch((err) => console.log(err));
  return correctedContend;
};

module.exports = { sendtoNLP, sendtoNLPasync };
