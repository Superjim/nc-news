const database = require("../db/connection");
const { checkCommentExists } = require("./checkCommentExists");
const { checkIfNumber } = require("./checkIfNumber");

const updateVotesByCommentId = async (inc_votes, comment_id) => {
  //check article_id is a number, check article exists,
  await checkCommentExists(comment_id);
  await checkIfNumber(comment_id);
  //check inc_votes exists
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: missing inc_votes parameter",
    });
  } else {
    await checkIfNumber(inc_votes);
    //update database
    const comment = await database.query(
      `
          UPDATE comments
          SET votes = votes + $2 
          WHERE comment_id = $1 
          RETURNING *
          `,
      [comment_id, inc_votes]
    );
    return comment.rows[0];
  }
};

module.exports = { updateVotesByCommentId };
