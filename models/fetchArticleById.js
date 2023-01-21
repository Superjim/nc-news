const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");

//This function first calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will return the article.
const fetchArticleById = async (article_id) => {
  //check article_id is a number, check article exists,
  await checkArticleExists(article_id);

  //fetch article
  const { rows } = await database.query(
    `
      SELECT author, title, article_id, body, topic, created_at, votes, article_img_url, 
      
      (SELECT COUNT(*) 
      FROM comments 
      WHERE article_id = articles.article_id)::integer AS comment_count

      FROM articles 
      WHERE article_id = $1
      `,
    [article_id]
  );
  return rows[0];
};

module.exports = {
  fetchArticleById,
};
