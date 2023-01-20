const { response } = require("express");
const express = require("express");
const app = express();

const {
  getAllTopics,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
  getAllUsers,
  removeCommentByCommentId,
  getEndpoints,
  getUserByUsername,
} = require("./controller");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUserByUsername);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchVotesByArticleId);
app.delete("/api/comments/:comment_id", removeCommentByCommentId);

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
