require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const http = require("http");
const https = require("https");
const { response } = require("express");
// const cors = require("cors");
// const router = require("./routes/main.js");
const Deepl = require("./deeplRequest");
const Nlp = require("./nlpRequest");
const Dandelion = require("./dandelionRequest");

const server = express();
server.use(express.static(path.join(__dirname, "public")));
// server.use(cors());
server.use(express.json());
// server.use("/", router);

let textOB = {};
let originEnglishText = "";
let germanTranslation = "";
let englishTranslation = "";
let optimizedGermanText = "";

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.get("/", (req, res) => res.render("pages/index"));

// translates the text in DE
server.post("/translate/DE", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }

  textOB.lang = "DE";
  textOB.text = req.body.text;

  originEnglishText = textOB.text;

  console.log("Eingangstext: " + textOB.text);

  germanTranslation = await Deepl(textOB);
  console.log("Übersetzter Text: " + germanTranslation);
  res.status(200).json({
    germanTranslation,
  });
});

// translates the text in EN
server.post("/translate/EN", async (req, res) => {
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

// optimizes the german input text
server.post("/optimize", async (req, res) => {
  if (!req.body.text) {
    res.status(400).send("missing the key 'text' in body");
    return;
  }
  console.log("Zu korrigierender Text: " + req.body.text);
  optimizedGermanText = await Nlp(req.body.text);
  console.log(optimizedGermanText);
  res.status(200).json({
    optimizedGermanText,
  });
});

// checks delta of two texts
server.get("/similarity", async (req, res) => {
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

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
