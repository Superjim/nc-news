const { fetchAllTopics, fetchAllArticles } = require("./model");

const getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

const getAllArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getAllTopics, getAllArticles };
