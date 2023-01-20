const database = require("../db/connection");

//This function responds with an array of user objects with username, name and avatar_url properties
const fetchAllUsers = async () => {
  const users = await database.query(
    `
        SELECT * FROM users
        `
  );
  return users.rows;
};

module.exports = { fetchAllUsers };
