const database = require("../db/connection");
const { checkIfNumber } = require("./checkIfNumber");

//This function checks if a article_id is a number, then checks if the article exists in the database.
//It will reject a promise if these conditions are not met, and pass an error to the handler.
const checkArticleExists = async (article_id) => {
  await checkIfNumber(article_id);
  const { rowCount } = await database.query(
    `
      SELECT * 
      FROM articles 
      WHERE article_id = $1
      `,
    [article_id]
  );
  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Article ${article_id} does not exist`,
    });
  }
};

module.exports = { checkArticleExists };
