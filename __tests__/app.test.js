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
          expect(response.body.msg).toBe("Article not found");
        });
    });
    test("400 - invalid id_number type - responds with status 400 and message: Invalid request: article_id is not found", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid request: article_id is not a number"
          );
        });
    });
  });
});
