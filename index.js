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

server.post('/api/text', (req, res, next) => {
    savedText = req.body.text;
    console.log(savedText);
    next();
})

server.use(async (req, res) => {
    translatedText = await Deepl(savedText)
    console.log(translatedText);
    res.status(200).json({
        message: 'Text translated successfully',
        text: translatedText
    });
});
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
