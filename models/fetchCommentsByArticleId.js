const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");

//This function first calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will return comments for the article_id
const fetchCommentsByArticleId = (article_id) => {
  //check article_id is a number, check article exists,
  return checkArticleExists(article_id).then(() => {
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
      .then(({ rows }) => {
        return rows;
      });
  });
};

module.exports = { fetchCommentsByArticleId };
