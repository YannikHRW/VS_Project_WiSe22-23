require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const routerExport = require("./routes/main");
const router = routerExport.router;
const server = express();

const cors = require("cors");
server.use(cors());

server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use("/", router);
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
