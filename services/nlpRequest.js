require("dotenv").config();
const axios = require("axios");

const sendtoNLP = async function (inputOB) {
  let correctedContent = "";
  const inputText = inputOB.inputText;
  const service = inputOB.service;

  console.log(inputText.length);
  if (inputText.length <= 250) {
    await axios({
      url: `https://api.nlpcloud.io/v1/gpu/de/finetuned-gpt-neox-20b/${service}`,
      method: "POST",
      headers: { Authorization: `Token ${process.env.NLP_KEY}` },
      data: { text: inputText },
    })
      .then((res) => {
        console.log("used normal req");
        correctedContent = Object.values(res.data)[0];
      })
      .catch((err) => {
        console.log(err);
      });

    return correctedContent;
  } else {
    let resUrl = "";
    let status = 0;

    await axios({
      url: `https://api.nlpcloud.io/v1/gpu/async/de/finetuned-gpt-neox-20b/${service}`,
      method: "POST",
      headers: { Authorization: `Token ${process.env.NLP_KEY}` },
      data: { text: inputText },
    })
      .then((res) => {
        status = res.status;
        resUrl = res.data.url;
      })
      .catch((err) => {
        console.log(err);
        status = err.response.status || 400;
      });

    while (status === 202) {
      await axios({
        url: resUrl,
        method: "GET",
        headers: { Authorization: `Token ${process.env.NLP_KEY}` },
      })
        .then((res) => {
          console.log(res.status);
          status = res.status;
          if (status !== 202) {
            const jsonContent = JSON.parse(res.data.content);
            correctedContent = Object.values(jsonContent)[0];
          }
        })
        .catch((err) => {
          console.log(err);
          status = err.response.status || 400;
        });
    }

    return correctedContent;
  }
};

module.exports = sendtoNLP;
