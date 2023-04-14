const express = require("express");
const router = express.Router();

const Deepl = require("../services/deeplRequest");
const NlpExport = require("../services/nlpRequest");
const Nlp = NlpExport.sendtoNLP;
const Dandelion = require("../services/dandelionRequest");

const vars = { originEnglishText: "", englishTranslation: "" };

router.get("/", (req, res) => {
  res.sendFile(`${path.join(__dirname, "public")}index.html`);
});

// translates the text in DE
router.post("/translate/DE", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }

  vars.originEnglishText = req.body.text;
  console.log("Eingangstext: " + vars.originEnglishText);
  let germanTranslation = await Deepl({
    lang: "DE",
    text: req.body.text,
  });
  console.log("Übersetzter Text: " + germanTranslation);
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

  console.log("Eingangstext: " + req.body.text);
  vars.englishTranslation = await Deepl({
    lang: "EN",
    text: req.body.text,
  });
  console.log("Übersetzter Text: " + vars.englishTranslation);
  res.status(200).json({
    englishTranslation: vars.englishTranslation,
  });
});

// gs correct the german input text
router.post("/optimize/gs-correction", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }
  console.log("Zu korrigierender Text: " + req.body.text);
  let optimizedTextGS = await Nlp({
    text: req.body.text,
    service: "gs-correction",
    asyncMode: req.body.text.length <= 250 ? "" : "async/",
  });
  console.log(optimizedTextGS);
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
  console.log("Zu korrigierender Text: " + req.body.text);
  let optimizedTextPara = await Nlp({
    text: req.body.text,
    service: "paraphrasing",
    asyncMode: req.body.text.length <= 250 ? "" : "async/",
  });
  console.log(optimizedTextPara);
  res.status(200).json({
    optimizedTextPara,
  });
});

// checks delta of two texts
router.get("/similarity/:mode?", async (req, res) => {
  if (!vars.originEnglishText || !vars.englishTranslation) {
    res
      .status(400)
      .send("can't compare if there is no origin text or no optimized text");
    return;
  }
  let syntacticMode = "";
  console.log(req.params.mode === "syntactic");
  if (req.params.mode === "syntactic") {
    syntacticMode = "bow=always&";
  }
  let delta = await Dandelion({
    text1: vars.originEnglishText,
    text2: vars.englishTranslation,
    syntacticMode,
  });
  console.log(delta);
  res.status(200).json({
    delta,
  });
});

module.exports = { router, vars };
