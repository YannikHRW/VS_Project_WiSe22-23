require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const PORT = process.env.PORT || 5000;
// const cors = require("cors");

const fs = require("fs");
const crypto = require("crypto");

const words = require("./assets/words.js");
const hashMapping = require("./audios/hashAudioNameMapping.json");

const server = express();
server.use(express.static(path.join(__dirname, "public")));
// server.use(cors());
server.use(express.json());

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
server.get("/", (req, res) => {
  res.sendFile(`${path.join(__dirname, "public")}index.html`);
});

/**
 * userOB ->
 *
 * <token>: {
 *    name: <name>,
 *    timeout: timeout(),
 *    audios: {hash: file, hash: file, ...}}
 */

// contains all temp users
let usersOB = {};

const Words = words.words;
const wordLength = Words.length;
const wordAmount = 2;

function startTimer(token) {
  // reset only if timeout was set once
  if (usersOB[token]?.timeout) {
    clearTimeout(usersOB[token].timeout);
  }
  usersOB[token].timeout = setTimeout(() => {
    // remove user after 30m with no interaction
    console.log("remove:", usersOB[token]);
    delete usersOB[token];
  }, 300000);
  console.log(usersOB);
}

server.get("/tokens", (req, res) => {
  const { name, audios } = usersOB;
  console.log(name, audios);
  res.json({ name, audios });
});

server.get("/users", (req, res) => {
  let userArray = [];
  for (const token in usersOB) {
    userArray.push(usersOB[token].name);
  }
  res.send(userArray);
});

server.get("/validate_token/:token", (req, res) => {
  const token = req.params.token;
  console.log("validate:", token);
  console.log("return", usersOB[token]?.name);
  res.send(usersOB[token]?.name);
});

server.get("/user/:name", (req, res) => {
  //response with error (user exists atm)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?retiredLocale=de
  for (const token in usersOB) {
    if (usersOB[token].name === req.params.name) {
      res.sendStatus(403);
      return;
    }
  }

  // set the new temporary user

  let rand = function () {
    return Math.random().toString(36).substring(2);
  };
  let generateToken = function () {
    return rand() + rand();
  };
  // set token for user
  const token = generateToken();
  usersOB[token] = { name: req.params.name };
  startTimer(token);
  console.log(token);
  res.send(token);
});

server.get("/audio/:token/:index", (req, res) => {
  console.log("request aiudos ");
  const wordIndex = req.params.index;
  const token = req.params.token;
  console.log(wordIndex);
  console.log(token);
  const options = {
    root: path.join(__dirname, "./audios"),
    acceptRanges: false,
  };
  const fileName = `${Object.values(usersOB[token].audios)[wordIndex]}.wav`;
  res.sendFile(fileName, options, function (err) {});
});

server.post("/result/:token", (req, res) => {
  const token = req.params.token;
  let result = {};
  for (let i = 0; i < wordAmount; i++) {
    result[Object.keys(usersOB[token].audios)[i]] = req.body[i];
  }
  res.json(result);
});

server.get("/game/:token", async (req, res) => {
  // reset user token when a new game begins
  const token = req.params.token;
  startTimer(token);

  const wordObject = {};

  async function buildWordOb() {
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
        await axios({
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
                console.log("updated mapping successfully\n");
              }
            }
          );
        }
      }
    }
  }

  await buildWordOb();

  usersOB[token].audios = wordObject;
  console.log("send resp");
  res.send(`${wordAmount}`);
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
