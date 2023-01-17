const { response } = require("express");
const database = require("./db/connection");

const fetchAllTopics = () => {
  return database
    .query(
      `
        SELECT * FROM topics
        `
    )
    .then((topics) => {
      return topics.rows;
    });
};

const fetchAllArticles = () => {
  return database
    .query(
      `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) as comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id, comments.article_id, articles.author 
        ORDER BY articles.created_at desc
        `
    )
    .then((articles) => {
      return articles.rows;
    });
};

const fetchArticleById = (article_id) => {
  return database
    .query(
      `
      SELECT author, title, article_id, body, topic, created_at, votes, article_img_url 
      FROM articles 
      WHERE article_id = $1
      `,
      [article_id]
    )
    .then((article) => {
      return article.rows[0];
    });
};

module.exports = { fetchAllTopics, fetchAllArticles, fetchArticleById };
