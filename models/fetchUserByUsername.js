const database = require("../db/connection");

//This function first calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will return the article.
const fetchUserByUsername = async (username) => {
  const { rows, rowCount } = await database.query(
    `
      SELECT * FROM users 
      WHERE username = $1
      `,
    [username]
  );

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `User ${username} does not exist`,
    });
  } else {
    return rows[0];
  }
};

module.exports = {
  fetchUserByUsername,
};
