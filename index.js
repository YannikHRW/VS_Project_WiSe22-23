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
let originEnglishText;
let translatedText;

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.get("/", (req, res) => res.render("pages/index"));

// translates the text in specified language (DE, EN)
server.post("/translate/:lang", async (req, res) => {
  textOB.lang = req.params.lang;
  textOB.text = req.body.text;

  if (textOB.lang === "DE") {
    originEnglishText = textOB.text;
  }
  console.log("Eingangstext: " + originEnglishText);
  console.log("Sprache: " + textOB.lang);

  translatedText = await Deepl(textOB);
  console.log("Übersetzter Text: " + translatedText);
  res.status(200).json({
    translatedText,
  });
});

// optimizes the german input text
server.post("/optimize", async (req, res) => {
  translatedText = req.body.text;
  if (typeof translatedText !== 'undefined') {
    console.log("Zu korrigierender Text: " + translatedText);
    let optimizedContent = await Nlp(translatedText);
    console.log(optimizedContent);
    res.status(200).json({
      optimizedContent,
    });
  }else{
    res.status(400).json({
      message: "No text sent"});
  }
});

// checks delta of two texts
server.get("/similarity", async (req, res) => {
  let delta = await Dandelion({
    text1: originEnglishText,
    text2: translatedText,
  });
  console.log(delta);
  res.status(200).json({
    delta,
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
