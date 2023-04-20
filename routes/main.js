const express = require("express");
const router = express.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/api-docu.json");

const Deepl = require("../services/deeplRequest");
const NlpExport = require("../services/nlpRequest");
const Nlp = NlpExport.sendtoNLP;
const Dandelion = require("../services/dandelionRequest");

const MAX_TEXT_LENGTH = 2000;

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

router.get("/", (req, res) => {
  res.sendFile(`${path.join(__dirname, "public")}index.html`);
});

router.get("/max-length", (req, res) => {
  res.json({ maxLength: MAX_TEXT_LENGTH });
});

// translates the text in german language
// respondes with code 400 when body is not set correctly
router.post("/translate/DE", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }
  if (req.body.text.length > MAX_TEXT_LENGTH) {
    res
      .status(400)
      .send(`Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`);
    return;
  }
  let germanTranslation = await Deepl({
    lang: "DE",
    text: req.body.text,
  });
  res.status(200).json({
    germanTranslation,
  });
});

// translates the text in english language
// respondes with code 400 when body is not set correctly
router.post("/translate/EN", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }
  if (req.body.text.length > MAX_TEXT_LENGTH) {
    res
      .status(400)
      .send(`Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`);
    return;
  }
  let englishTranslation = await Deepl({
    lang: "EN",
    text: req.body.text,
  });
  res.status(200).json({
    englishTranslation,
  });
});

// corrects the german input text grammar and spelling
// respondes with code 400 when body is not set correctly
router.post("/optimize/gs-correction", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }
  if (req.body.text.length > MAX_TEXT_LENGTH) {
    res
      .status(400)
      .send(`Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`);
    return;
  }
  let optimizedTextGS = await Nlp({
    text: req.body.text,
    service: "gs-correction",
    asyncMode: req.body.text.length <= 250 ? "" : "async/",
  });
  res.status(200).json({
    optimizedTextGS,
  });
});

// paraphrases the german input text
// respondes with code 400 when body is not set correctly
router.post("/optimize/paraphrasing", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }
  if (req.body.text.length > MAX_TEXT_LENGTH) {
    res
      .status(400)
      .send(`Error: Max text length is ${MAX_TEXT_LENGTH} tokens.`);
    return;
  }
  let optimizedTextPara = await Nlp({
    text: req.body.text,
    service: "paraphrasing",
    asyncMode: req.body.text.length <= 250 ? "" : "async/",
  });
  res.status(200).json({
    optimizedTextPara,
  });
});

// calculates the delta between two english texts
// default calculation bases on semantic check
// mode can be set as syntactic in url
// respondes with code 400 when body is not set correctly
router.post("/similarity/:mode?", async (req, res) => {
  if (!req.body.originEnglishText || !req.body.englishTranslation) {
    res
      .status(400)
      .send("can't compare if there is no origin text or no optimized text");
    return;
  }

  // dandelion api only accepts 4096 chars long URI (request url was 5865 characters long, max is 4096)
  // 77 chars are already set by default url tokens like this: /datatxt/sim/v1/?lang=en&text1=&text2=&token=12341234123412341234123412341234
  // so for each text is only a text length of 2000 tokens including the URI Codes allowed
  if (
    encodeURIComponent(req.body.originEnglishText).length > MAX_TEXT_LENGTH ||
    encodeURIComponent(req.body.englishTranslation).length > MAX_TEXT_LENGTH
  ) {
    res
      .status(400)
      .send(
        `Error: This char amount is not supported for similarity check. Try with less tokens!`
      );
    return;
  }
  let syntacticMode = "";
  if (req.params.mode === "syntactic") {
    syntacticMode = "bow=always&";
  }
  let delta = await Dandelion({
    text1: req.body.originEnglishText,
    text2: req.body.englishTranslation,
    syntacticMode,
  });
  res.status(200).json({
    delta,
  });
});

module.exports = { router, MAX_TEXT_LENGTH };
