const database = require("../db/connection");
const { checkArticleExists } = require("./checkArticleExists");

//This function first checks username and body are included in the body. It then calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will then check the username to check a user exists. After passing all these checks, it will post a comment to the database, RETURNING *
const addNewComment = (username, body, article_id) => {
  //check username is included in body
  if (!username) {
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
    //check article_id is a number, check article exists,
    return (
      checkArticleExists(article_id)
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

module.exports = { addNewComment };
