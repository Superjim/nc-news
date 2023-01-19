const { response } = require("express");
const database = require("./db/connection");

//This function checks if a article_id is a number, then checks if the article exists in the database.
//It will reject a promise if these conditions are not met, and pass an error to the handler.
const checkArticleExists = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid request: ${article_id} is not a number`,
    });
  }
  return database
    .query(
      `
    SELECT * 
    FROM articles 
    WHERE article_id = $1
    `,
      [article_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} does not exist`,
        });
      }
    });
};

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

//This function will respond with an array of all the article objects.
const fetchAllArticles = ({
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
  return fetchAllTopics()
    .then((topics) => {
      validTopic = topics.map((topic) => topic.slug);
      validTopic.push("");
      return validTopic;
    })
    .then((validTopic) => {
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

      return database
        .query(
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
        )
        .then((articles) => {
          return articles.rows;
        });
    });
};

//This function first calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will return the article.
const fetchArticleById = (article_id) => {
  //check article_id is a number, check article exists,
  return checkArticleExists(article_id)
    .then(() => {
      return database.query(
        `
      SELECT author, title, article_id, body, topic, created_at, votes, article_img_url, 
      
      (SELECT COUNT(*) 
      FROM comments 
      WHERE article_id = articles.article_id)::integer AS comment_count

      FROM articles 
      WHERE article_id = $1
      `,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

//This function first calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will return comments for the article_id
const fetchCommentsByArticleId = (article_id) => {
  //check article_id is a number, check article exists,
  return checkArticleExists(article_id).then(() => {
    return database
      .query(
        `
      SELECT comment_id, votes, created_at, author, body, article_id 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at desc 
      `,
        [article_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  });
};

//This function first checks username and body are included in the body. It then calls checkArticleExists helper function. If the promise chain is not broken by the helper function, it will then check the username to check a user exists. After passing all these checks, it will post a comment to the database, RETURNING *
const addNewComment = (username, body, article_id) => {
  //check username is included in body
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: username is missing",
    });
    //check body is included in body
  } else if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: body is missing",
    });
  } else {
    //check article_id is a number, check article exists,
    return (
      checkArticleExists(article_id)
        //check user exists in database
        .then(() => {
          return database
            .query(
              `
        SELECT * 
        FROM users 
        WHERE username = $1 
        `,
              [username]
            )
            .then((user) => {
              if (user.rows.length === 0) {
                return Promise.reject({
                  status: 404,
                  msg: `Username ${username} not found in database`,
                });
              }
            });
        })
        .then(() => {
          //post comment to database
          return database
            .query(
              `
        INSERT INTO comments 
        (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
              [username, body, article_id]
            )
            .then((comment) => {
              return comment.rows[0];
            });
        })
    );
  }
};

const updateVotesByArticleId = (inc_votes, article_id) => {
  //check article_id is a number, check article exists,
  return checkArticleExists(article_id).then(() => {
    //check inc_votes exists
    if (!inc_votes) {
      return Promise.reject({
        status: 400,
        msg: "Invalid request: missing inc_votes parameter",
      });
      //check inc_votes is a number
    } else if (isNaN(inc_votes)) {
      return Promise.reject({
        status: 400,
        msg: `Invalid request: ${inc_votes} is not a number`,
      });
    } else {
      //update database
      return database
        .query(
          `
        UPDATE articles 
        SET votes = votes + $2 
        WHERE article_id = $1 
        RETURNING *
        `,
          [article_id, inc_votes]
        )
        .then((article) => {
          return article.rows[0];
        });
    }
  });
};

module.exports = {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  addNewComment,
  updateVotesByArticleId,
  fetchAllUsers,
};
