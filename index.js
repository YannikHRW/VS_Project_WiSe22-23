require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const http = require('http');
const https = require('https');
const {response} = require("express");
// const cors = require("cors");
// const router = require("./routes/main.js");
const Deepl = require("./deeplRequest")

const server = express();
server.use(express.static(path.join(__dirname, "public")));
// server.use(cors());
server.use(express.json());
// server.use("/", router);

let savedText;
let translatedText;

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.get('/', (req, res) => res.render('pages/index'))

//Nimmt den deutschen Ursprungstext entgegen
server.post('/api/text', (req, res, next) => {
    savedText = req.body.text;
    console.log("Eingangstext: " +savedText);
    //next(); ruft automatisch die nächste Middleware zur Übersetzung auf
    next();
})

//Übersetzt den Text und sendet ihn an das Frontend zurück
server.use(async (req, res) => {
    translatedText = await Deepl(savedText)
    console.log("Übersetzter Text: " +translatedText);
    res.status(200).json({
        message: 'Text translated successfully',
        text: translatedText
    });
});

//Nimmt den übersetzten und ggf. abgeänderten Text vom Frontend entgegen
server.post('/api/translated-text', (req, res, next) => {
    translatedText = req.body.text;
    console.log("Zu korrigierender Text: " +translatedText);
    //next(); ruft automatisch die nächste Middleware zur Korrektur des Textes auf
    next();
})

//Diese Middleware korrigiert den Text
server.use(async (req, res) => {});


server.listen(PORT, () => console.log(`Listening on ${PORT}`));


