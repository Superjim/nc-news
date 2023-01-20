const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");

const updateVotesByArticleId = (inc_votes, article_id) => {
  //check article_id is a number, check article exists,
  return checkArticleExists(article_id).then(() => {
    //check inc_votes exists
    if (!inc_votes) {
      return Promise.reject({
        status: 400,
        msg: "Invalid request: missing inc_votes parameter",
      });
      //check inc_votes is a number
    } else if (isNaN(inc_votes)) {
      return Promise.reject({
        status: 400,
        msg: `Invalid request: ${inc_votes} is not a number`,
      });
    } else {
      //update database
      return database
        .query(
          `
          UPDATE articles 
          SET votes = votes + $2 
          WHERE article_id = $1 
          RETURNING *
          `,
          [article_id, inc_votes]
        )
        .then((article) => {
          return article.rows[0];
        });
    }
  });
};

module.exports = { updateVotesByArticleId };
