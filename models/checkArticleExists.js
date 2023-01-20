const database = require("../db/connection");

//This function checks if a article_id is a number, then checks if the article exists in the database.
//It will reject a promise if these conditions are not met, and pass an error to the handler.
const checkArticleExists = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid request: ${article_id} is not a number`,
    });
  }
  return database
    .query(
      `
      SELECT * 
      FROM articles 
      WHERE article_id = $1
      `,
      [article_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} does not exist`,
        });
      }
    });
};

module.exports = { checkArticleExists };
