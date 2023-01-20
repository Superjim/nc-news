const database = require("../db/connection");

//This helper function firstly checks if comment_id is a number. If not, it will reject the promise. It then checks if a comment exists by comment_id, it will return true if it exists and reject the promise if it doesn't.
const checkCommentExists = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid request: ${comment_id} is not a number`,
    });
  }
  return database
    .query(
      `
      SELECT * FROM comments 
      WHERE comment_id = $1 
      `,
      [comment_id]
    )
    .then((comment) => {
      if (comment.rowCount > 0) return true;
      else
        return Promise.reject({
          status: 404,
          msg: `Comment ${comment_id} does not exist`,
        });
    });
};

module.exports = { checkCommentExists };
