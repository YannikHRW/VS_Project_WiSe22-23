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

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.get('/', (req, res) => res.render('pages/index'))

server.post('/api/text', (req, res, next) => {
    savedText = req.body.text;
    console.log(savedText);
    res.status(200).json({
        message: 'Text sent successfully'
    });
})

server.get("/deepl", (req, res) => {
    Deepl(savedText)
  res.status(200);
});
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
