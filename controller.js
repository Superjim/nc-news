const { fetchArticleById } = require("./models/fetchArticleById");
const {
  fetchCommentsByArticleId,
} = require("./models/fetchCommentsByArticleId");
const { fetchEndpoints } = require("./models/fetchEndpoints");
const { fetchAllTopics } = require("./models/fetchAllTopics");
const { fetchAllUsers } = require("./models/fetchAllUsers");
const { fetchAllArticles } = require("./models/fetchAllArticles");
const {
  deleteCommentByCommentId,
} = require("./models/deleteCommentByCommentId");
const { updateVotesByArticleId } = require("./models/updateVotesByArticleId");
const { addNewComment } = require("./models/addNewComment");

const getEndpoints = (request, response, next) => {
  fetchEndpoints()
    .then((endpoints) => response.status(200).send({ endpoints }))
    .catch((error) => next(error));
};

const getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => response.status(200).send({ topics }))
    .catch((error) => next(error));
};

const getAllArticles = (request, response, next) => {
  fetchAllArticles(request.query)
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

const patchVotesByArticleId = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  updateVotesByArticleId(inc_votes, article_id)
    .then((article) => response.status(200).send({ article }))
    .catch((error) => next(error));
};

const removeCommentByCommentId = (request, response, next) => {
  const { comment_id } = request.params;
  deleteCommentByCommentId(comment_id)
    .then(() => response.status(204).send())
    .catch((error) => next(error));
};

module.exports = {
  getAllTopics,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
  getAllUsers,
  removeCommentByCommentId,
  getEndpoints,
};
