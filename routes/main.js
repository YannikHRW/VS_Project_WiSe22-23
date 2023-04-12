const express = require("express");
const router = express.Router();

const Deepl = require("../services/deeplRequest");
const Nlp = require("../services/nlpRequest");
const Dandelion = require("../services/dandelionRequest");

const vars = { textOB: {}, originEnglishText: "", englishTranslation: "" };

router.get("/", (req, res) => res.render("pages/index"));

// translates the text in DE
router.post("/translate/DE", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }

  vars.textOB.lang = "DE";
  vars.textOB.text = req.body.text;

  vars.originEnglishText = vars.textOB.text;

  console.log("Eingangstext: " + vars.originEnglishText);

  let germanTranslation = await Deepl(vars.textOB);
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

  vars.textOB.lang = "EN";
  vars.textOB.text = req.body.text;

  console.log("Eingangstext: " + vars.textOB.text);

  vars.englishTranslation = await Deepl(vars.textOB);
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
    inputText: req.body.text,
    service: "gs-correction",
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
    inputText: req.body.text,
    service: "paraphrasing",
  });
  console.log(optimizedTextPara);
  res.status(200).json({
    optimizedTextPara,
  });
});

// checks delta of two texts
router.get("/similarity", async (req, res) => {
  if (!vars.originEnglishText || !vars.englishTranslation) {
    res
      .status(400)
      .send("can't compare if there is no origin text or no optimized text");
    return;
  }
  let delta = await Dandelion({
    text1: vars.originEnglishText,
    text2: vars.englishTranslation,
  });
  console.log(delta);
  res.status(200).json({
    delta,
  });
});

module.exports = { router, vars };
