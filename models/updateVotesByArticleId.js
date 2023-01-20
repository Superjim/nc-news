const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");

const updateVotesByArticleId = async (inc_votes, article_id) => {
  //check article_id is a number, check article exists,
  await checkArticleExists(article_id);
  //check inc_votes exists
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: missing inc_votes parameter",
    });
  } else if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid request: ${inc_votes} is not a number`,
    });
  } else {
    //update database
    const article = await database.query(
      `
          UPDATE articles 
          SET votes = votes + $2 
          WHERE article_id = $1 
          RETURNING *
          `,
      [article_id, inc_votes]
    );
    return article.rows[0];
  }
};

module.exports = { updateVotesByArticleId };
