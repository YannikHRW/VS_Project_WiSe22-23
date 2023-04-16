require("dotenv").config();
const sendtoDandelion = require("../services/dandelionRequest");

const axios = require("axios");

jest.mock("axios");

describe("Dandelion fetchData", () => {
  it("fetches successfully data from dandelion API", async () => {
    const res = {
      data: {
        similarity: 1,
      },
      status: 200,
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(res));
    const mockTextOB = {
      text1: "This is my text",
      text2: "This is my text",
      syntacticMode: "",
    };
    await expect(sendtoDandelion(mockTextOB)).resolves.toEqual({
      originEnglishText: "This is my text",
      optimizedEnglishText: "This is my text",
      similarity: 1,
    });
    expect(axios.post).toHaveBeenCalledWith(
      `https://api.dandelion.eu/datatxt/sim/v1/?lang=en&${mockTextOB.syntacticMode}text1=text&text2=text&token=${process.env.Dandelion_KEY}`,
      { text1: mockTextOB.text1, text2: mockTextOB.text2 }
    );
  });

  it("fetches erroneously data from dandelion API", async () => {
    const mockTextOB = {
      text1: "This is my text",
      text2: "This is my text",
      syntacticMode: "bow=always&",
    };
    const err = { response: { status: 400 } };
    axios.post.mockImplementationOnce(() => Promise.reject(err));
    await expect(sendtoDandelion(mockTextOB)).resolves.toStrictEqual({
      optimizedEnglishText: "This is my text",
      originEnglishText: "This is my text",
      similarity: "Error: Dandelion-API responded with a 400 Code.",
    });
  });
});
