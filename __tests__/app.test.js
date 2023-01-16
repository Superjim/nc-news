const { app } = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const database = require("../db/connection");
const testData = require("../db/data/test-data/index");
const { response } = require("express");
const { forEach } = require("../db/data/test-data/users");

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
});
