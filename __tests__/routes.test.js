const express = require("express");
const request = require("supertest");

const routerExport = require("../routes/main");
const router = routerExport.router;
const vars = routerExport.vars;
let textOB = vars.textOB;

const server = express();
const bodyParser = require("body-parser");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use("/", router);

describe("Test routes", function () {
  /* test("responds to /", async () => {
    const res = await request(server).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
  }); */

  beforeEach(() => {
    vars.originEnglishText = "";
    vars.englishTranslation = "";
  });

  test("responds properly to /translate/DE and /translate/EN with wrong key in body", async () => {
    const mockedBody = {
      tefxt: "test",
    };

    const resDE = await request(server).post(`/translate/DE`).send(mockedBody);
    expect(resDE.status).toBe(400);
    expect(resDE.text).toBe("missing the key 'text' in body");
    expect(textOB).toStrictEqual({});

    const resEN = await request(server).post(`/translate/EN`).send(mockedBody);
    expect(resEN.status).toBe(400);
    expect(resEN.text).toBe("missing the key 'text' in body");
    expect(textOB).toStrictEqual({});
  });

  test("responds properly to /translate/DE and /translate/EN with empty body", async () => {
    const mockedBody = {};

    const resDE = await request(server).post(`/translate/DE`).send(mockedBody);
    expect(resDE.status).toBe(400);
    expect(resDE.text).toBe("missing the key 'text' in body");
    expect(textOB).toStrictEqual({});

    const resEN = await request(server).post(`/translate/EN`).send(mockedBody);
    expect(resEN.status).toBe(400);
    expect(resEN.text).toBe("missing the key 'text' in body");
    expect(textOB).toStrictEqual({});
  });

  test("responds properly to /translate/DE and /translate/EN with correct body", async () => {
    const resDE = await request(server)
      .post(`/translate/DE`)
      .send({ text: "this is a test" });
    expect(textOB).toStrictEqual({ lang: "DE", text: "this is a test" });
    expect(resDE.status).toBe(200);
    expect(vars.originEnglishText).toBe("this is a test");
    expect(resDE.body).toStrictEqual({
      germanTranslation: "Dies ist ein Test",
    });

    const resEN = await request(server)
      .post(`/translate/EN`)
      .send({ text: "das ist ein test" });
    expect(textOB).toStrictEqual({ lang: "EN", text: "das ist ein test" });
    expect(resEN.status).toBe(200);
    expect(resEN.body).toStrictEqual({ englishTranslation: "this is a test" });
  });
  // ....
  test("responds properly to /optimize/gs-correction with wrong key in body", async () => {
    const mockedBody = {
      tefxt: "test",
    };

    const res = await request(server)
      .post(`/optimize/gs-correction`)
      .send(mockedBody);
    expect(res.status).toBe(400);
    expect(res.text).toBe("missing the key 'text' in body");
  });

  test("responds properly to /optimize/gs-correction with empty body", async () => {
    const mockedBody = {};

    const res = await request(server)
      .post(`/optimize/gs-correction`)
      .send(mockedBody);
    expect(res.status).toBe(400);
    expect(res.text).toBe("missing the key 'text' in body");
  });

  test("responds properly to /optimize/gs-correction with correct body", async () => {
    const res = await request(server)
      .post(`/optimize/gs-correction`)
      .send({ text: "das ist ein test" });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ optimizedTextGS: "Dies ist ein Test" });
  });
  //...
  test("responds properly to /optimize/paraphrasing with wrong key in body", async () => {
    const mockedBody = {
      tefxt: "test",
    };

    const res = await request(server)
      .post(`/optimize/paraphrasing`)
      .send(mockedBody);
    expect(res.status).toBe(400);
    expect(res.text).toBe("missing the key 'text' in body");
  });

  test("responds properly to /optimize/paraphrasing with empty body", async () => {
    const mockedBody = {};

    const res = await request(server)
      .post(`/optimize/paraphrasing`)
      .send(mockedBody);
    expect(res.status).toBe(400);
    expect(res.text).toBe("missing the key 'text' in body");
  });

  test("responds properly to /optimize/paraphrasing with correct body", async () => {
    const res = await request(server)
      .post(`/optimize/paraphrasing`)
      .send({ text: "das ist ein test" });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      optimizedTextPara: "Dies ist eine Prüfung.",
    });
  });
  //...
  test("responds properly to /similarity check when no word is set", async () => {
    const res = await request(server).get(`/similarity`);
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "can't compare if there is no origin text or no optimized text"
    );
  });

  test("responds properly to /similarity check when 'originEnglishText' and 'englishTranslation' is set", async () => {
    vars.originEnglishText = "teste diese sache hier";
    vars.englishTranslation = "teste diese Sacha hier";

    const res2 = await request(server).get(`/similarity`);
    expect(res2.status).toBe(200);
    expect(res2.body).toStrictEqual({
      delta: {
        optimizedEnglishText: "teste diese Sacha hier",
        originEnglishText: "teste diese sache hier",
        similarity: 0.7556,
      },
    });
  });
});
