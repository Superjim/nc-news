const database = require("../db/connection");
const { checkIfNumber } = require("./checkIfNumber");

//This helper function firstly checks if comment_id is a number. If not, it will reject the promise. It then checks if a comment exists by comment_id, it will return true if it exists and reject the promise if it doesn't.
const checkCommentExists = async (comment_id) => {
  await checkIfNumber(comment_id);
  const comment = await database.query(
    `
      SELECT * FROM comments 
      WHERE comment_id = $1 
      `,
    [comment_id]
  );
  if (comment.rowCount > 0) return true;
  else
    return Promise.reject({
      status: 404,
      msg: `Comment ${comment_id} does not exist`,
    });
};

module.exports = { checkCommentExists };
