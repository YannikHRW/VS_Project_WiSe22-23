require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const routerExport = require("./routes/main");
const router = routerExport.router;

const server = express();
server.use(express.static(path.join(__dirname, "public")));
server.use(
  cors({
    origin: ["https://vs-project-group-12.herokuapp.com", "https://editor.swagger.io"],
  })
);
server.use(express.json());
server.use("/", router);

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
