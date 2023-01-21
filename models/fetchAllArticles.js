const database = require("../db/connection");
const { checkIfNumber } = require("./checkIfNumber");
const { checkTopicExists } = require("./checkTopicExists");

//This function will respond with an array of all the article objects.
const fetchAllArticles = async ({
  sort_by = "created_at",
  order = "desc",
  topic = "",
  limit = 10,
  p = 1,
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

  //if custom topic
  if (topic !== "") {
    const topics = topic.split(",");

    // Check the topics exists, allow default topic = empty string as valid topic
    for (let i = 0; i < topics.length; i++) {
      await checkTopicExists(topics[i]);
    }
    //where clause, add each topic in topics
    topic = `WHERE topic IN (${topics.map((topic) => `'${topic}'`)})`;
  }

  //pagination validity checks
  await checkIfNumber(limit);
  await checkIfNumber(p);
  if (limit < 1 || limit > 50)
    return Promise.reject({ status: 400, msg: "Invalid limit amount" });
  if (p < 1) return Promise.reject({ status: 400, msg: "Invalid page number" });

  //calculatethe offset
  const offset = (p - 1) * limit;

  //fetch all articles from database
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
          LIMIT ${limit} OFFSET ${offset}
          `
  );

  //fetching total number of articles
  const total_count = await database.query(
    `SELECT COUNT(*) FROM articles ${topic}`
  );
  return { articles: articles.rows, total_count: +total_count.rows[0].count };
};

module.exports = { fetchAllArticles };
