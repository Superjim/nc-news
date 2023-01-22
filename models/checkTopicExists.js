const { fetchAllTopics } = require("./fetchAllTopics");

//This function retrieves a list of topics from the database.
const checkTopicExists = async (topic, topicShouldExist = true) => {
  //fetch array of all topics on database
  const topics = await fetchAllTopics();
  //create new array of the topic slug (topic name)
  validTopic = topics.map((topic) => topic.slug);
  //If the topic does not exist and topicShouldExist is (default) true, the function returns a rejected promise
  if (!validTopic.includes(topic) && topicShouldExist === true) {
    return Promise.reject({
      status: 404,
      msg: `Topic ${topic} does not exist`,
    });
    //If the topic does exist and topicShouldExist is false, the function returns a rejected promise
  } else if (validTopic.includes(topic) && topicShouldExist === false) {
    return Promise.reject({
      status: 400,
      msg: `Invalid request: topic ${topic} already exists`,
    });
  } else {
    return true;
  }
};

module.exports = { checkTopicExists };
