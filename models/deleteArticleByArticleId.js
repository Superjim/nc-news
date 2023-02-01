const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");

//This function calls the checkArticleExists function to make sure the article_id is a number, and that the Article exists in the database. If both checks pass, it will delete the Article from the database by the article_id
const deleteArticleByArticleId = async (article_id) => {
  //check article_id is a number, check Article exists
  await checkArticleExists(article_id);
  return await database.query(
    `
          DELETE FROM articles 
          WHERE article_id = $1
          `,
    [article_id]
  );
};

module.exports = { deleteArticleByArticleId };
