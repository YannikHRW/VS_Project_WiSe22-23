require("dotenv").config();
const axios = require("axios");

/**
 * send nlp request
 * @param {Object} textOB {text: "...", service: "gs-correction" / "paraphrasing", asyncMode: "" / "async/"}
 * @returns nlp api response optimized text. Error msg in case api sends error
 */
const sendtoNLP = async function (inputOB) {
  let res = await fetchAPI(inputOB);
  let status = res.status;

  // if response code is 202, send new request to initial responded url until it response with 200
  while (status === 202) {
    let beggingRes = await fetchAPIBegging(res.data.url);
    status = beggingRes.status;
    if (status === 200) {
      res.data =
        typeof beggingRes.data.content === "string"
          ? JSON.parse(beggingRes.data.content)
          : beggingRes.data.content;
    }
  }

  if (status === 200) {
    return Object.values(res.data)[0];
  } else {
    return `Error: NLP-API responded with a ${status} Code.`;
  }
};
/**
 * fetch nlp api
 * @returns response
 */
const fetchAPI = async (inputOB) => {
  return await axios
    .post(
      `https://api.nlpcloud.io/v1/gpu/${inputOB.asyncMode}de/finetuned-gpt-neox-20b/${inputOB.service}`,
      { text: inputOB.text },
      { headers: { Authorization: `Token ${process.env.NLP_KEY}` } }
    )
    .catch((err) => {
      console.log(err);
      return err.response;
    });
};

/**
 * fetch nlp api with async url
 * @returns response
 */
const fetchAPIBegging = async (resURL) => {
  return await axios
    .get(resURL, { headers: { Authorization: `Token ${process.env.NLP_KEY}` } })
    .catch((err) => {
      console.log(err);
      return err.response;
    });
};

module.exports = { sendtoNLP, fetchAPIBegging };
