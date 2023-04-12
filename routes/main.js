const express = require("express");
const router = express.Router();

const Deepl = require("../services/deeplRequest");
const Nlp = require("../services/nlpRequest");
const Dandelion = require("../services/dandelionRequest");

let textOB = {};
let originEnglishText = "";
let englishTranslation = "";

router.get("/", (req, res) => res.render("pages/index"));

// translates the text in DE
router.post("/translate/DE", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }

  textOB.lang = "DE";
  textOB.text = req.body.text;

  originEnglishText = textOB.text;

  console.log("Eingangstext: " + textOB.text);

  let germanTranslation = await Deepl(textOB);
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

  textOB.lang = "EN";
  textOB.text = req.body.text;

  console.log("Eingangstext: " + textOB.text);

  englishTranslation = await Deepl(textOB);
  console.log("Übersetzter Text: " + englishTranslation);
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
  if (!originEnglishText || !englishTranslation) {
    res
      .status(400)
      .send("can't compare if there is no origin text or no optimized text");
    return;
  }
  let delta = await Dandelion({
    text1: originEnglishText,
    text2: englishTranslation,
  });
  console.log(delta);
  res.status(200).json({
    delta,
  });
});

module.exports = router;
