const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");
const { checkIfNumber } = require("./checkIfNumber");

//This function first calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will return comments for the article_id
const fetchCommentsByArticleId = async (article_id, limit = 10, p = 1) => {
  //pagination validity checks
  if (limit < 1 || limit > 50)
    return Promise.reject({ status: 400, msg: "Invalid limit amount" });
  if (p < 1) return Promise.reject({ status: 400, msg: "Invalid page number" });

  await checkIfNumber(limit);
  await checkIfNumber(p);

  //check article_id is a number, check article exists,
  await checkArticleExists(article_id);

  const offset = (p - 1) * limit;

  const { rows } = await database.query(
    `
        SELECT comment_id, votes, created_at, author, body, article_id 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at desc 
        LIMIT $2 OFFSET $3
        `,
    [article_id, limit, offset]
  );
  return rows;
};

module.exports = { fetchCommentsByArticleId };
