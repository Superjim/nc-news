const database = require("../db/connection");
const { checkTopicExists } = require("./checkTopicExists");

const addNewTopic = async (slug, description) => {
  if (!slug) {
    throw {
      status: 400,
      msg: "Invalid request: slug is missing",
    };
  } else if (!description) {
    throw {
      status: 400,
      msg: "Invalid request: description is missing",
    };
  }
  //if topic does not already exist
  await checkTopicExists(slug, false);

  //post topic to the database
  const topic = await database.query(
    `
    INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *
    `,
    [slug, description]
  );

  return topic.rows[0];
};

module.exports = { addNewTopic };
