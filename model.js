const { response } = require("express");
const database = require("./db/connection");

const fetchAllTopics = () => {
  return database
    .query(
      `
    SELECT * FROM topics;
    `
    )
    .then((topics) => {
      return topics.rows;
    });
};

module.exports = { fetchAllTopics };
