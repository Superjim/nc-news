const database = require("../db/connection");
const { fetchAllTopics } = require("./fetchAllTopics");

//This function will respond with an array of all the article objects.
const fetchAllArticles = async ({
  sort_by = "created_at",
  order = "desc",
  topic = "",
}) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const validOrder = ["asc", "desc"];
  // Build an array of valid topics. Query the database for all valid topics, and then push empty string to it
  const topics = await fetchAllTopics();
  validTopic = topics.map((topic_1) => topic_1.slug);
  validTopic.push("");
  //is sort_by valid
  if (!validSortBy.includes(sort_by))
    return Promise.reject({
      status: 400,
      msg: `Invalid request: can not sort by ${sort_by}`,
    });
  //is order valid
  if (!validOrder.includes(order))
    return Promise.reject({
      status: 400,
      msg: `Invalid request: can not order by ${order}`,
    });
  //is topic valid
  if (!validTopic.includes(topic))
    return Promise.reject({
      status: 404,
      msg: `Topic ${topic} does not exist`,
    });
  //if topic exists, add where clause
  if (topic !== "") topic = `WHERE topic = '${topic}'`;
  const articles = await database.query(
    `
          SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
          COUNT(comments.article_id)::integer AS comment_count 
          FROM articles 
          LEFT JOIN comments 
          ON articles.article_id = comments.article_id 
          ${topic} 
          GROUP BY articles.article_id, comments.article_id, articles.author 
          ORDER BY articles.${sort_by} ${order}
          `
  );
  return articles.rows;
};

module.exports = { fetchAllArticles };
