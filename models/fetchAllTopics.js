const database = require("../db/connection");

//This function responds with an array of topic objects with slug and description properties.
const fetchAllTopics = async () => {
  const topics = await database.query(
    `
          SELECT * FROM topics
          `
  );
  return topics.rows;
};

module.exports = { fetchAllTopics };
