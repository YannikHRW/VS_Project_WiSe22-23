const express = require("express");
const request = require("supertest");

const routerExport = require("../routes/main");
const router = routerExport.router;
const MAX_TEXT_LENGTH = routerExport.MAX_TEXT_LENGTH;

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

  test("responds to /max-length", async () => {
    const res = await request(server).get("/max-length");
    console.log(res.text.maxLength);
    expect(res.body).toStrictEqual({
      maxLength: 2000,
    });
  });

  // need to encrease timeout for request with long text
  jest.setTimeout(30000);

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

  test("responds properly to /translate/DE and /translate/EN with text more than max amount tokens", async () => {
    const mockedBody = {
      text: `Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte `,
    };

    const resDE = await request(server).post(`/translate/DE`).send(mockedBody);
    expect(resDE.status).toBe(400);
    expect(resDE.text).toBe(
      `Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`
    );

    const resEN = await request(server).post(`/translate/EN`).send(mockedBody);
    expect(resEN.status).toBe(400);
    expect(resDE.text).toBe(
      `Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`
    );
  });

  test("responds properly to /translate/DE and /translate/EN with correct body", async () => {
    const resDE = await request(server)
      .post(`/translate/DE`)
      .send({ text: "this is a test" });
    expect(resDE.status).toBe(200);
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

  test("responds properly to /optimize/gs-correction with text more than max amount tokens", async () => {
    const mockedBody = {
      text: `Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte `,
    };

    const res = await request(server)
      .post(`/optimize/gs-correction`)
      .send(mockedBody);
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      `Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`
    );
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

  test("responds properly to /optimize/paraphrasing with text more than max amount tokens", async () => {
    const mockedBody = {
      text: `Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte `,
    };

    const res = await request(server)
      .post(`/optimize/paraphrasing`)
      .send(mockedBody);
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      `Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`
    );
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
    const res = await request(server).post(`/similarity`).send({
      originEnglishText: "",
      englishTranslation: "",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "can't compare if there is no origin text or no optimized text"
    );
  });

  test("responds properly to /similarity check with wrong body", async () => {
    const res = await request(server).post(`/similarity`).send({
      hallo: "",
      test: "",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "can't compare if there is no origin text or no optimized text"
    );
  });

  test("responds properly to /similarity check with text more than max amount tokens", async () => {
    const res = await request(server).post(`/similarity`).send({
      originEnglishText:
        "Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte Aufgabe zur Gruppenarbeit im Modul: „Verteilte System Aufgabe zur Gruppenarbeit im Modul: „Verteilte ",
      englishTranslation: "t",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      `Error: This char amount is not supported for similarity check. Try with less tokens!`
    );
  });

  test("responds properly to /similarity check with correct body", async () => {
    const res = await request(server).post(`/similarity`).send({
      originEnglishText: "test this thing here",
      englishTranslation: "test this thing here please",
    });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      delta: {
        optimizedEnglishText: "test this thing here please",
        originEnglishText: "test this thing here",
        similarity: 1,
      },
    });
  });

  test("responds properly to /similarity/syntactic check with correct body", async () => {
    const res = await request(server).post(`/similarity/syntactic`).send({
      originEnglishText: "test this thing here",
      englishTranslation: "test this thing here please",
    });
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
