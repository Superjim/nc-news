const database = require("../db/connection");
const { checkCommentExists } = require("./checkCommentExists");

//This function calls the checkCommentExists function to make sure the comment_id is a number, and that the comment exists in the database. If both checks pass, it will delete the comment from the database by the comment_id
const deleteCommentByCommentId = (comment_id) => {
  //check comment_id is a number, check comment exists
  return checkCommentExists(comment_id).then(() => {
    return database.query(
      `
          DELETE FROM comments 
          WHERE comment_id = $1
          `,
      [comment_id]
    );
  });
};

module.exports = { deleteCommentByCommentId };
