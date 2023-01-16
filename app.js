const express = require("express");
const app = express();
const { getAllTopics, getAllArticles } = require("./controller");

app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);

// Error handling

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    console.log(error);
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = { app };
