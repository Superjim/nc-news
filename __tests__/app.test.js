const { app } = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const database = require("../db/connection");
const testData = require("../db/data/test-data/index");
const { response } = require("express");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  database.end();
});

describe("nc-news", () => {
  describe("GET /api/topics", () => {
    test("responds with status 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("responds with an array of topic objects, with atleast one topic", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const allTopics = response.body.topics;
          expect(Array.isArray(allTopics)).toBe(true);
          expect(allTopics.length > 0).toBe(true);
          allTopics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test("responds with status 200", () => {
      return request(app).get("/api/articles").expect(200);
    });
    test("responds with an array of article objects, with atleast one article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const allArticles = response.body.articles;
          expect(Array.isArray(allArticles)).toBe(true);
          expect(allArticles.length > 0).toBe(true);
          allArticles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("responds with an array of articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const allArticles = response.body.articles;
          expect(Array.isArray(allArticles)).toBe(true);
          expect(allArticles.length > 0).toBe(true);
          //Date parse the created_at property and check its greater than the next one along the array. Run to array.length - 1 so it doesnt compare undefined.
          for (let i = 0; i < allArticles.length - 1; i++) {
            expect(Date.parse(allArticles[i].created_at)).toBeGreaterThan(
              Date.parse(allArticles[i + 1].created_at)
            );
          }
        });
    });
    test("responds with an array of articles related to the topic", () => {
      const topics = ["mitch", "cats", "paper"];
      for (let i = 0; i < topics.length; i++) {
        return request(app)
          .get(`/api/articles?topic=${topics[i]}`)
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(Array.isArray(articles)).toBe(true);
            articles.forEach((article) => {
              expect(article).toHaveProperty("topic", topics[i]);
            });
          });
      }
    });
    test("responds with an array of articles sorted with date asc", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          const allArticles = response.body.articles;
          expect(Array.isArray(allArticles)).toBe(true);
          expect(allArticles.length > 0).toBe(true);
          //Date parse the created_at property and check its greater than the next one along the array. Run to array.length - 1 so it doesnt compare undefined.
          for (let i = 0; i < allArticles.length - 1; i++) {
            expect(Date.parse(allArticles[i].created_at)).toBeLessThan(
              Date.parse(allArticles[i + 1].created_at)
            );
          }
        });
    });
    test("responds with error 404 and message when topic isnt in database", () => {
      return request(app)
        .get("/api/articles?topic=jim")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Topic jim does not exist");
        });
    });
    test("responds with error 400 when given invalid sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=jim")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: can not sort by jim"
          );
        });
    });
    test("responds with error 400 when given invalid order", () => {
      return request(app)
        .get("/api/articles?order=hello")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: can not order by hello"
          );
        });
    });
    test("responds with array sorted by author default desc", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((response) => {
          const allArticles = response.body.articles;
          expect(allArticles[0].author).toBe("rogersop");
          expect(allArticles[5].author).toBe("icellusedkars");
          expect(allArticles[10].author).toBe("butter_bridge");
        });
    });
    test("responds with array sorted by body asc", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then((response) => {
          const allArticles = response.body.articles;
          expect(allArticles[0].author).toBe("butter_bridge");
          expect(allArticles[5].author).toBe("icellusedkars");
          expect(allArticles[10].author).toBe("rogersop");
        });
    });
    test("responds with array of topics mitch sorted by author asc", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=asc")
        .expect(200)
        .then((response) => {
          const allArticles = response.body.articles;
          allArticles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
          expect(allArticles[0].author).toBe("butter_bridge");
          expect(allArticles[5].author).toBe("icellusedkars");
          expect(allArticles[10].author).toBe("rogersop");
        });
    });
  });
  describe("GET /api/article/:article_id", () => {
    test("responds with status 200", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("responds with an object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(typeof article === "object").toBe(true);
          expect(article !== null).toBe(true);
        });
    });
    test("responds with an object with the correct properties and property types", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article).toHaveProperty("author", "butter_bridge");
          expect(article).toHaveProperty(
            "title",
            "Living in the shadow of a great man"
          );
          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty("comment_count", 11);
          expect(article).toHaveProperty(
            "body",
            "I find this existence challenging"
          );
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes", 100);
          expect(article).toHaveProperty(
            "article_img_url",
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("404 - valid but none-existent id_number - responds with status 404 and a message: Article not found", () => {
      return request(app)
        .get("/api/articles/500")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article 500 does not exist");
        });
    });
    test("400 - invalid id_number type - responds with status 400 and message: Invalid request: hello is not a number", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: hello is not a number"
          );
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("responds with status 200", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });
    test("responds with an array of comments objects with atleast one comment, with the all comments having correct property types, and first object has the correct properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const allComments = response.body.comments;
          expect(Array.isArray(allComments)).toBe(true);
          expect(allComments.length > 0).toBe(true);
          allComments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
          });
          expect(allComments[0].comment_id).toBe(5);
          expect(allComments[0].votes).toBe(0);
          expect(allComments[0].author).toBe("icellusedkars");
          expect(allComments[0].body).toBe("I hate streaming noses");
          expect(allComments[0].article_id).toBe(1);
        });
    });
    test("responds with an empty comment object when there are no comments for an article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
    test("responds with an array of comment objects sorted by date with most recent comments first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length > 0).toBe(true);
          //Date parse the created_at property and check its greater than the next one along the array. Run to array.length - 1 so it doesnt compare undefined.
          for (let i = 0; i < comments.length - 1; i++) {
            expect(Date.parse(comments[i].created_at)).toBeGreaterThan(
              Date.parse(comments[i + 1].created_at)
            );
          }
        });
    });
    test("404 - valid but none-existent article id_number - responds with status 404 and a message: Article not found", () => {
      return request(app)
        .get("/api/articles/499/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article 499 does not exist");
        });
    });
    test("400 - invalid article id_number type - responds with status 400 and message: Invalid request: article_id is not a number", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: hello is not a number"
          );
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("responds with status 201 and the posted comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Do we need to use an existing username?",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const comment = response.body.comment;
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).toHaveProperty("author", "butter_bridge");
          expect(comment).toHaveProperty(
            "body",
            "Do we need to use an existing username?"
          );
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("votes", 0);
        });
    });
    test("responds with error 400 and message when comment is missing username ", () => {
      const newComment = {
        body: "Do we need to use an existing username?",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: username is missing"
          );
        });
    });
    test("responds with error 400 and message when comment is missing body ", () => {
      const newComment = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid request: body is missing");
        });
    });
    test("responds with error 400 and message when article type is invalid", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Do we need to use an existing username?",
      };
      return request(app)
        .post("/api/articles/hello/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: hello is not a number"
          );
        });
    });
    test("responds with error 404 and message when article does not exist", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Do we need to use an existing username?",
      };
      return request(app)
        .post("/api/articles/500/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article 500 does not exist");
        });
    });
    test("responds with error 404 and message when username does not exist in database", () => {
      const newComment = {
        username: "jim",
        body: "Do we need to use an existing username?",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Username jim not found in database");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("responds with status 200 and the correct updated article for incrementing vote + 1", () => {
      const vote1 = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/1/")
        .send(vote1)
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article).toHaveProperty("author", "butter_bridge");
          expect(article).toHaveProperty(
            "title",
            "Living in the shadow of a great man"
          );
          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty(
            "body",
            "I find this existence challenging"
          );
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes", 101);
          expect(article).toHaveProperty(
            "article_img_url",
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("responds with status 200 and the updated article for decrementing vote - 1", () => {
      const vote1 = {
        inc_votes: -1,
      };
      return request(app)
        .patch("/api/articles/1/")
        .send(vote1)
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article).toHaveProperty("votes", 99);
        });
    });
    test("database is correctly updated, post request then get request", () => {
      const vote5 = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/1/")
        .send(vote5)
        .then(() => {
          return request(app)
            .get("/api/articles/1")
            .then((response) => {
              const article = response.body.article;
              expect(article).toHaveProperty("votes", 105);
            });
        });
    });
    test("responds with error 404 and message when article does not exist", () => {
      const vote1 = {
        inc_votes: -1,
      };
      return request(app)
        .patch("/api/articles/4500/")
        .send(vote1)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article 4500 does not exist");
        });
    });
    test("responds with error 400 and message when object doesn't contain the right key of inc_votes", () => {
      const vote1 = {
        hello: "there",
      };
      return request(app)
        .patch("/api/articles/1/")
        .send(vote1)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: missing inc_votes parameter"
          );
        });
    });
    test("responds with error 400 and message when inc_votes is not a number", () => {
      const vote1 = {
        inc_votes: "hello",
      };
      return request(app)
        .patch("/api/articles/1/")
        .send(vote1)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: hello is not a number"
          );
        });
    });
  });
  describe("GET /api/users", () => {
    test("responds with status 200", () => {
      return request(app).get("/api/users").expect(200);
    });
    test("responds with an array of user objects, with atleast one user", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const allUsers = response.body.users;
          expect(Array.isArray(allUsers)).toBe(true);
          expect(allUsers.length === 4).toBe(true);
          allUsers.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
          expect(allUsers[0].username).toBe("butter_bridge");
          expect(allUsers[0].name).toBe("jonny");
          expect(allUsers[0].avatar_url).toBe(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
        });
    });
  });
  describe("DELETE /api/comments/1", () => {
    test("returns status 204 and no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("comment is deleted", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(2);
        })
        .then(() => {
          return request(app).delete("/api/comments/1").expect(204);
        })
        .then(() => {
          return request(app).get("/api/articles/9/comments").expect(200);
        })
        .then((response) => {
          expect(response.body.comments.length).toBe(1);
        });
    });
    test("returns error 404 comment does not exist", () => {
      return request(app)
        .delete("/api/comments/250")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment 250 does not exist");
        });
    });
    test("400 - invalid comment id - responds with status 400 and message: Invalid request: hello is not a number", () => {
      return request(app)
        .delete("/api/comments/hello")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: hello is not a number"
          );
        });
    });
  });
  describe("GET /api", () => {
    test("returns endpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            endpoints: {
              "GET /api": {
                description:
                  "Returns a JSON representation of all available endpoints of the API.",
              },
              "GET /api/topics": {
                description:
                  "Retrieves an array of all the available topics in the database, each in the form of an object with keys 'slug' and 'description'.",
                exampleResponse: {
                  topics: [
                    {
                      slug: "mitch",
                      description: "All information related to Mitch",
                    },
                    {
                      slug: "cats",
                      description: "All information related to dogs",
                    },
                    {
                      slug: "paper",
                      description: "All information related to paper",
                    },
                  ],
                },
              },
              "GET /api/users": {
                description:
                  "Retrieves an array of all registered users in the database, each in the form of an object with keys 'username', 'name' and 'avatar_url'.",
                exampleResponse: {
                  users: [
                    {
                      username: "butter_bridge",
                      name: "Jonny",
                      avatar_url:
                        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                    },
                    {
                      username: "icellusedkars",
                      name: "Mitch",
                      avatar_url:
                        "https://img.freepik.com/free-vector/cute-cat-bread-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4224.jpg?auto=format&h=200",
                    },
                  ],
                },
              },
              "GET /api/articles": {
                description:
                  "Retrieves an array of all articles in the API. Default queries include 'sort_by' (created_at), 'order' (desc) and 'topic' (all). Additional query parameters include 'sort_by' (article_id, title, topic, author, body, created_at, votes), 'order' (asc, desc), and 'topic' (slug of topic).",
                queries: ["sort_by", "order", "topic"],
                validSortBy: [
                  "article_id",
                  "title",
                  "topic",
                  "author",
                  "body",
                  "created_at",
                  "votes",
                ],
                validOrder: ["asc", "desc"],
                validTopic: "slug of topic in the database",
                exampleResponse: {
                  articles: [
                    {
                      author: "icellusedkars",
                      title: "Eight pug gifs that remind me of mitch",
                      article_id: 3,
                      topic: "mitch",
                      created_at: "2020-11-03T09:12:00.000Z",
                      votes: 0,
                      article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      comment_count: 2,
                    },
                    {
                      author: "butter_bridge",
                      title: "Living in the shadow of a great man",
                      article_id: 1,
                      body: "I find this existence challenging",
                      topic: "mitch",
                      created_at: "2020-07-09T20:11:00.000Z",
                      votes: 100,
                      article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      comment_count: 11,
                    },
                  ],
                },
              },
              "GET /api/article/:article_id": {
                description:
                  "Retrieves a single article by its 'article_id'. The 'article_id' must be passed as an integer.",
                queries: "article_id",
                exampleResponse: {
                  article: {
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: 11,
                  },
                },
              },
              "GET /api/article/:article_id/comments": {
                description:
                  "Retrieves an array of all comments assigned to the specified 'article_id'. The 'article_id' parameter must be passed as an integer.",
                queries: "article_id",
                exampleResponse: {
                  comments: [
                    {
                      comment_id: 5,
                      votes: 0,
                      created_at: "2020-11-03T21:00:00.000Z",
                      author: "icellusedkars",
                      body: "I hate streaming noses",
                      article_id: 1,
                    },
                    {
                      comment_id: 7,
                      votes: 10,
                      created_at: "2021-01-19T09:00:00.000Z",
                      author: "butter_bridge",
                      body: "I love this article!",
                      article_id: 1,
                    },
                  ],
                },
              },
              "POST /api/article/:article_id/comments": {
                description:
                  "Posts a new comment to the database. The 'article_id' must be passed as an integer, and the 'username' must match an existing user in the database. The new comment is returned.",
                queries: "article_id",
                validUsers: "username must exist in the database",
                exampleBody: {
                  username: "butter_bridge",
                  body: "I loved this article!",
                },
                exampleResponse: {
                  comment: {
                    comment_id: 19,
                    body: "I loved this article!",
                    article_id: 1,
                    author: "butter_bridge",
                    votes: 0,
                    created_at: "2023-01-19T14:57:40.334Z",
                  },
                },
              },
              "PATCH /api/article/:article_id": {
                description:
                  "Updates the vote value of an existing article. The 'article_id' must be passed as an integer. The updated article is returned.",
                queries: "article_id",
                exampleBody: {
                  inc_votes: -1,
                },
                exampleResponse: {
                  article: {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 99,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  },
                },
              },
              "DELETE /api/comments/:comment_id": {
                description:
                  "Deletes a single comment by its 'comment_id'. The 'comment_id' parameter must be passed as an integer.",
                queries: "comment_id",
              },
            },
          });
        });
    });
  });
});
