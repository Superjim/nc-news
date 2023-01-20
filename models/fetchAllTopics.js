const database = require("../db/connection");

//This function responds with an array of topic objects with slug and description properties.
const fetchAllTopics = () => {
  return database
    .query(
      `
          SELECT * FROM topics
          `
    )
    .then((topics) => {
      return topics.rows;
    });
};

module.exports = { fetchAllTopics };
