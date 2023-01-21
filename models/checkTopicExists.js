const { fetchAllTopics } = require("./fetchAllTopics");

//This function retrieves a list of topics from the database. You can whitelist as many additional valid topics as you want. A use case of this would be to pass in "" which will default to all topics
const checkTopicExists = async (topic, ...additionalTopics) => {
  //fetch array of all topics on database
  const topics = await fetchAllTopics();
  //create new array of the topic slug (topic name)
  validTopic = topics.map((topic) => topic.slug);
  //push optional additional topics
  validTopic = validTopic.concat(additionalTopics);
  if (!validTopic.includes(topic)) {
    return Promise.reject({
      status: 404,
      msg: `Topic ${topic} does not exist`,
    });
  } else {
    return true;
  }
};

module.exports = { checkTopicExists };
