require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const router = require("./routes/main");

const server = express();
server.use(express.static(path.join(__dirname, "public")));
server.use(
  cors({
    origin: ["https://editor.swagger.io"],
  })
);
server.use(express.json());
server.use("/", router);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
