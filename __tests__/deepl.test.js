require("dotenv").config();
const DeeplExport = require("../services/deeplRequest");
const fetchAPI = DeeplExport.fetchAPI;
const sendtoDeepL = DeeplExport.sendtoDeepL;

const axios = require("axios");

jest.mock("axios");

describe("fetchData", () => {
  it("fetches successfully data from deepl API", async () => {
    const res = {
      data: {
        translations: [{ text: "Das ist mein Text" }],
      },
      status: 200,
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(res));
    const mockRequest = { text: "This is my text", lang: "DE" };
    await expect(sendtoDeepL(mockRequest)).resolves.toEqual(
      "Das ist mein Text"
    );
    expect(axios.post).toHaveBeenCalledWith(
      `https://api-free.deepl.com/v2/translate?auth_key=${
        process.env.DEEPL_KEY
      }&text=${encodeURIComponent(mockRequest.text)}&target_lang=${
        mockRequest.lang
      }`
    );
  });

  it("fetches erroneously data from deepl API", async () => {
    const mockRequest = { text: "This is my text", lang: "DE" };
    const err = { response: { status: 400 } };
    axios.post.mockImplementationOnce(() => Promise.reject(err));
    await expect(sendtoDeepL(mockRequest)).resolves.toStrictEqual(
      "Error: Deepl-API responded with a 400 Code."
    );
  });
});
