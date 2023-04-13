require("dotenv").config();
const NlpExport = require("../services/nlpRequest");
const sendToNLP = NlpExport.sendtoNLP;
const fetchAPIBegging = NlpExport.fetchAPIBegging;

const axios = require("axios");

jest.mock("axios");

describe("NLP fetchData", () => {
  it("fetches successfully data from nlp API in normal mode", async () => {
    const res = {
      data: { text: "Das ist mein optimierter text" },
      status: 200,
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(res));

    const mockinputOB = {
      text: "Das ist mein text",
      service: "paraphrasing",
      asyncMode: "",
    };

    await expect(sendToNLP(mockinputOB)).resolves.toEqual(
      "Das ist mein optimierter text"
    );
    expect(axios.post).toHaveBeenCalledWith(
      `https://api.nlpcloud.io/v1/gpu/${mockinputOB.asyncMode}de/finetuned-gpt-neox-20b/${mockinputOB.service}`,
      { text: mockinputOB.text },
      { headers: { Authorization: `Token ${process.env.NLP_KEY}` } }
    );
  });

  it("fetches successfully data from nlp API in async mode", async () => {
    const mockinputOB = {
      text: "Das ist mein text langer text",
      service: "paraphrasing",
      asyncMode: "async/",
    };

    const res1 = {
      data: { url: "http://test.test" },
      status: 202,
    };
    const res2 = {
      data: { content: { text: "Das ist mein optimierter text" } },
      status: 200,
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(res1));
    axios.get.mockImplementationOnce(() => Promise.resolve(res2));

    await expect(sendToNLP(mockinputOB)).resolves.toEqual(
      "Das ist mein optimierter text"
    );

    expect(axios.post).toHaveBeenCalledWith(
      `https://api.nlpcloud.io/v1/gpu/${mockinputOB.asyncMode}de/finetuned-gpt-neox-20b/${mockinputOB.service}`,
      { text: mockinputOB.text },
      { headers: { Authorization: `Token ${process.env.NLP_KEY}` } }
    );
  });

  it("fetches erroneously data from nlp API in post", async () => {
    const mockinputOB = {
      text: "Das ist mein text",
      service: "paraphrasing",
      asyncMode: "",
    };
    const err = { response: { status: 400 } };
    axios.post.mockImplementationOnce(() => Promise.reject(err));

    await expect(sendToNLP(mockinputOB)).resolves.toStrictEqual(
      "Error: NLP-API responded with a 400 Code."
    );
  });

  it("fetches erroneously data from nlp API in get", async () => {
    const err = { response: { status: 400 } };
    axios.get.mockImplementationOnce(() => Promise.reject(err));
    await expect(fetchAPIBegging("url")).resolves.toStrictEqual({
      status: 400,
    });
  });
});
