const database = require("../db/connection");

//This function responds with an array of user objects with username, name and avatar_url properties
const fetchAllUsers = () => {
  return database
    .query(
      `
        SELECT * FROM users
        `
    )
    .then((users) => {
      return users.rows;
    });
};

module.exports = { fetchAllUsers };
