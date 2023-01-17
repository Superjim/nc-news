const e = require("express");
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

//This function firstly checks the request parameter is a number, before querying the database
//On database request return, checks if an article exists before returning either the article or an error message
const fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: article_id is not a number",
    });
  } else {
    return database
      .query(
        `
      SELECT author, title, article_id, body, topic, created_at, votes, article_img_url 
      FROM articles 
      WHERE article_id = $1
      `,
        [article_id]
      )
      .then(({ rowCount, rows }) => {
        if (rowCount === 0) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else {
          return rows[0];
        }
      });
  }
};

//This function firstly checks the request parameter is a number, before querying the database
//On database request return, checks if comments exists before returning either an array of comments or an error message
const fetchCommentsByArticleId = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: article_id is not a number",
    });
  } else {
    return database
      .query(
        `
    SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at desc 
    `,
        [article_id]
      )
      .then(({ rowCount, rows }) => {
        if (rowCount === 0) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else {
          return rows;
        }
      });
  }
};

const addNewComment = (username, body, article_id) => {
  //check if article_id param is a number
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: article_id is not a number",
    });
    //check username is included in body
  } else if (!username) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: username is missing",
    });
    //check body is included in body
  } else if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: body is missing",
    });
  } else {
    //check article exists in database
    return (
      database
        .query(
          `
      SELECT * 
      FROM articles 
      WHERE article_id = $1  
      `,
          [article_id]
        )
        .then((article) => {
          if (article.rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: `Article ${article_id} does not exist`,
            });
          }
        })
        //check user exists in database
        .then(() => {
          return database
            .query(
              `
        SELECT * 
        FROM users 
        WHERE username = $1 
        `,
              [username]
            )
            .then((user) => {
              if (user.rows.length === 0) {
                return Promise.reject({
                  status: 404,
                  msg: `Username ${username} not found in database`,
                });
              }
            });
        })
        .then(() => {
          //post comment to database
          return database
            .query(
              `
        INSERT INTO comments 
        (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
              [username, body, article_id]
            )
            .then((comment) => {
              return comment.rows[0];
            });
        })
    );
  }
};

module.exports = {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  addNewComment,
};
