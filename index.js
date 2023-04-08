require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const fs = require("fs");
const crypto = require("crypto");

const words = require("./assets/words.js");
const hashMapping = require("./audios/hashAudioNameMapping.json");

const server = express();
server.use(express.static(path.join(__dirname, "public")));
server.use(cors());
server.use(express.json());

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
server.get("/", (req, res) => {
  res.sendFile(`${path.join(__dirname, "public")}index.html`);
});

const users = {};
const Words = words.words;
const wordLength = Words.length;
const wordAmount = 10;

server.post("/set-username", (req, res) => {
  const data = req.body;
  if (users.data) {
    //response with error
  } else {
    // set the new temporary user
    users.data = {};
  }
});

server.get("/audio/:index", (req, res) => {
  const wordIndex = req.params.index;
  const options = {
    root: path.join(__dirname, "./audios"),
    acceptRanges: false,
  };
  const fileName = `${Object.values(users.peter)[wordIndex]}.wav`;
  res.sendFile(fileName, options, function (err) {});
});

server.get("/users", (req, res) => {
  res.json(users);
});

server.post("/result", (req, res) => {
  let result = {};
  for (let i = 0; i < wordAmount; i++) {
    result[Object.keys(users.peter)[i]] = req.body[i];
  }
  res.json(result);
});

server.get("/download", (req, res) => {
  // name
  const name = "peter";
  const wordObject = {};

  for (let i = 1; i <= wordAmount; i++) {
    // initial random index
    let randomIndex = Math.floor(Math.random() * wordLength);
    let randomWord = Words[randomIndex];

    // reset random index as long as word is already in object
    while (wordObject[randomWord]) {
      randomIndex = Math.floor(Math.random() * wordLength);
      randomWord = Words[randomIndex];
    }

    // hash the word
    const wordHash = crypto
      .createHash("sha256")
      .update(randomWord)
      .digest("hex");

    // add key (word) value (hash) to object
    wordObject[randomWord] = wordHash;

    // get file from api if not alredy in directory
    if (!fs.existsSync(`./audios/${wordHash}.wav`)) {
      // create path for wav with hash as name
      const destinationPath = path.resolve(
        __dirname,
        "audios",
        `${wordHash}.wav`
      );
      const writer = fs.createWriteStream(destinationPath);

      // get file from rss api and write it in stream
      axios({
        url: `http://api.voicerss.org/?key=${process.env.VOICE_RRS_KEY}&hl=en-us&src=${randomWord}`,
        method: "GET",
        responseType: "stream",
      }).then((response) => {
        response.data.pipe(writer);
      });

      // if mapping dosnt contain word alread, add
      if (!hashMapping[wordHash]) {
        hashMapping[wordHash] = randomWord;
        fs.writeFile(
          "./audios/hashAudioNameMapping.json",
          JSON.stringify(hashMapping),
          (err) => {
            if (err) console.log(err);
            else {
              console.log("File written successfully\n");
            }
          }
        );
      }
    }
  }
  users[name] = wordObject;
  res.sendStatus(200);
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
