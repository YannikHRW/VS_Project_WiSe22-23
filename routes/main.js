const express = require("express");
const router = express.Router();
const axios = require("axios");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(`${path.join(__dirname, "pages")}index.ejs`);
});

module.exports = router;
