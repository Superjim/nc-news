const { request } = require("express");
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  addNewComment,
  updateVotesByArticleId,
  fetchAllUsers,
} = require("./model");

const getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => response.status(200).send({ topics }))
    .catch((error) => next(error));
};

const getAllArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => response.status(200).send({ articles }))
    .catch((error) => next(error));
};

const getAllUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => response.status(200).send({ users }))
    .catch((error) => next(error));
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => response.status(200).send({ article }))
    .catch((error) => next(error));
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => response.status(200).send({ comments }))
    .catch((error) => next(error));
};

const postCommentByArticleId = (request, response, next) => {
  const { username, body } = request.body;
  const { article_id } = request.params;
  addNewComment(username, body, article_id)
    .then((comment) => response.status(201).send({ comment }))
    .catch((error) => next(error));
};

const postVotesByArticleId = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  updateVotesByArticleId(inc_votes, article_id)
    .then((article) => response.status(201).send({ article }))
    .catch((error) => next(error));
};

module.exports = {
  getAllTopics,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  postVotesByArticleId,
  getAllUsers,
};
