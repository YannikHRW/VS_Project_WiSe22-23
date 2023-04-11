require("dotenv").config();
const axios = require("axios");

const sendtoNLP = async function (inputText) {
  let correctedContent = "";
  console.log(inputText.length);
  if (inputText.length <= 250) {
    await axios({
      url: `https://api.nlpcloud.io/v1/gpu/finetuned-gpt-neox-20b/gs-correction`,
      method: "POST",
      headers: { Authorization: `Token ${process.env.NLP_KEY}` },
      data: { text: inputText },
    })
      .then((res) => {
        console.log("used normal req");
        correctedContent = res.data.correction;
      })
      .catch((err) => console.log(err));

    return correctedContent;
  } else {
    let resUrl = "";
    let status = 202;

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
            console.log("used async req");
            const jsonContent = JSON.parse(res.data.content);
            correctedContent = jsonContent.correction;
          }
        })
        .catch((err) => console.log(err));
    }

    return correctedContent;
  }
};

module.exports = sendtoNLP;
