const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");
const { checkUserExists } = require("./checkUserExists");

//This function first checks username and body are included in the body. It then calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will then check the username to check a user exists. After passing all these checks, it will post a comment to the database, RETURNING *
const addNewComment = async (username, body, article_id) => {
  //check username is included in body
  if (!username) {
    throw {
      status: 400,
      msg: "Invalid request: username is missing",
    };
    //check body is included in body
  } else if (!body) {
    throw {
      status: 400,
      msg: "Invalid request: body is missing",
    };
  } else {
    //check article_id is a number, check article exists,
    await checkArticleExists(article_id);

    //check user exists in database
    await checkUserExists(username);

    //post comment to database
    const comment = await database.query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    );

    return comment.rows[0];
  }
};

module.exports = { addNewComment };
