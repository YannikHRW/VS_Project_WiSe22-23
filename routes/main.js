const express = require("express");
const router = express.Router();

const Deepl = require("../services/deeplRequest");
const NlpExport = require("../services/nlpRequest");
const Nlp = NlpExport.sendtoNLP;
const Dandelion = require("../services/dandelionRequest");

router.get("/", (req, res) => {
  res.sendFile(`${path.join(__dirname, "public")}index.html`);
});

// translates the text in DE
router.post("/translate/DE", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
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

// translates the text in EN
router.post("/translate/EN", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
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

// gs correct the german input text
router.post("/optimize/gs-correction", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
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
router.post("/optimize/paraphrasing", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
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

// checks delta of two texts
router.post("/similarity/:mode?", async (req, res) => {
  if (!req.body.originEnglishText || !req.body.englishTranslation) {
    res
      .status(400)
      .send("can't compare if there is no origin text or no optimized text");
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

module.exports = router;
