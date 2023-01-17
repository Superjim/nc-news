const { response } = require("express");
const express = require("express");
const app = express();
const {
  getAllTopics,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controller");

app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// Error handling

app.use((request, reponse, next) => {
  response.status(404).send({ msg: "path not found" });
});

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    console.log(error);
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = { app };
