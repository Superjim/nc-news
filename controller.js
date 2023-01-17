const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
} = require("./model");

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

//This function firstly checks the request parameter is a number.
//It then passes the parameter to the model, and on return, checks if an article exists before returning either the article or an error message
const getArticleById = (request, response, next) => {
  const article_id = request.params.article_id;
  if (isNaN(article_id)) {
    response
      .status(400)
      .send({ msg: "Invalid request: article_id is not a number" });
  } else {
    fetchArticleById(article_id)
      .then((article) => {
        if (article) response.status(200).send({ article });
        else response.status(404).send({ msg: "Article not found" });
      })
      .catch((error) => {
        next(error);
      });
  }
};

module.exports = { getAllTopics, getAllArticles, getArticleById };
