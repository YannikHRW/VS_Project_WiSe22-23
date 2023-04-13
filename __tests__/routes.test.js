const express = require("express");
const request = require("supertest");

const routerExport = require("../routes/main");
const router = routerExport.router;
const vars = routerExport.vars;

const server = express();
const bodyParser = require("body-parser");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use("/", router);

describe("Test routes", function () {
  test("responds to /", async () => {
    const res = await request(server).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
  });

  // need to encrease timeout for request with long text
  jest.setTimeout(30000);

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

    const resEN = await request(server).post(`/translate/EN`).send(mockedBody);
    expect(resEN.status).toBe(400);
    expect(resEN.text).toBe("missing the key 'text' in body");
  });

  test("responds properly to /translate/DE and /translate/EN with empty body", async () => {
    const mockedBody = {};

    const resDE = await request(server).post(`/translate/DE`).send(mockedBody);
    expect(resDE.status).toBe(400);
    expect(resDE.text).toBe("missing the key 'text' in body");

    const resEN = await request(server).post(`/translate/EN`).send(mockedBody);
    expect(resEN.status).toBe(400);
    expect(resEN.text).toBe("missing the key 'text' in body");
  });

  test("responds properly to /translate/DE and /translate/EN with correct body", async () => {
    const resDE = await request(server)
      .post(`/translate/DE`)
      .send({ text: "this is a test" });
    expect(resDE.status).toBe(200);
    expect(vars.originEnglishText).toBe("this is a test");
    expect(resDE.body).toStrictEqual({
      germanTranslation: "Dies ist ein Test",
    });

    const resEN = await request(server)
      .post(`/translate/EN`)
      .send({ text: "das ist ein test" });
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

  test("responds properly to /optimize/gs-correction with correct body and input token amount over 250", async () => {
    const res = await request(server)
      .post(`/optimize/gs-correction`)
      .send({
        text: `Sie müssen zunächst einige Benutzerszenarien definieren, die Ihre Ideen für die
      Implementierungen und die Anforderungen im Zusammenhang mit den von Ihnen
      vorgeschlagenen Konzepten veranschaulichen, bevor Sie diese entwerfen und umsetzen.
      Bitte nehmen Sie sich Zeit und überlegen Sie sich, wie Sie das MashUp entwickeln wollen. Im
      Rahmen der Dokumentation sollen Sie ebenfalls die Innovation Ihrer Lösung
      verargumentieren. Für die Umsetzung können Sie beliebige Web-Technologien, sowie
      gängige Programmiersprachen, verwenden`,
      });
    expect(res.status).toBe(200);
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
      .send({ text: "das ist ein auto" });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      optimizedTextPara: "Dies ist ein Automobil.",
    });
  });

  test("responds properly to /optimize/paraphrasing with correct body and input token amount over 250", async () => {
    const res = await request(server)
      .post(`/optimize/paraphrasing`)
      .send({
        text: `Sie müssen zunächst einige Benutzerszenarien definieren, die Ihre Ideen für die
      Implementierungen und die Anforderungen im Zusammenhang mit den von Ihnen
      vorgeschlagenen Konzepten veranschaulichen, bevor Sie diese entwerfen und umsetzen.
      Bitte nehmen Sie sich Zeit und überlegen Sie sich, wie Sie das MashUp entwickeln wollen. Im
      Rahmen der Dokumentation sollen Sie ebenfalls die Innovation Ihrer Lösung
      verargumentieren. Für die Umsetzung können Sie beliebige Web-Technologien, sowie
      gängige Programmiersprachen, verwenden`,
      });
    expect(res.status).toBe(200);
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
    vars.originEnglishText = "test this thing here";
    vars.englishTranslation = "test this thing here please";

    const res = await request(server).get(`/similarity`);
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      delta: {
        optimizedEnglishText: "test this thing here please",
        originEnglishText: "test this thing here",
        similarity: 1,
      },
    });
  });

  test("responds properly to /similarity/syntactic check when 'originEnglishText' and 'englishTranslation' is set", async () => {
    vars.originEnglishText = "test this thing here";
    vars.englishTranslation = "test this thing here please";

    const res = await request(server).get(`/similarity/syntactic`);
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      delta: {
        optimizedEnglishText: "test this thing here please",
        originEnglishText: "test this thing here",
        similarity: 0.7202,
      },
    });
  });
});
