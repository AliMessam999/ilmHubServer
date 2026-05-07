const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    message: "Backend Connected Successfully"
  });
});

module.exports = app;
module.exports.handler = serverless(app);