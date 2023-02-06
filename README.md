# NC-News

## About

NC-News is a backend service built as part of a week-long project for my Northcoders bootcamp. It mimics the functionality of a real-world service such as Reddit, providing information to the front-end architecture. With this API, you can access a variety of news topics, registered users, and articles, and perform various actions such as sorting, ordering, and filtering. With the instructions provided in this README, you will be able to set up and run the project locally, and begin experimenting with the available routes and features.

## Deployment

This project is currently deployed at https://nc-news-6g30.onrender.com/api. You can access the deployed API by making requests to this URL.

The project is deployed using the latest version of my github projects main folder.

If you would like to deploy the project yourself locally, you can do so by following the instructions in the "To setup and run this project locally" section of this README, or [**skip ahead to the routes**](#6.-Routes)

### To setup and run this project locally:

## 1. Clone this repository and open the root directory

```bash
git clone https://github.com/Superjim/nc-news
```

```bash
cd nc-news
```

## 2. Create .env files

Create two .env files, .env.test and .env.development in the nc-news directory.

In the .env.test file, you should add the following line:

```
PGDATABASE=nc_news_test
```

In the .env.development file, add the following:

```
PGDATABASE=nc_news
```

## 3. Install dependencies

This project requires a minimum version of Node.js 6.0.0, which supports the ES6 syntax used in the code. It is recommended to use the latest long-term support (LTS) version of Node.js, which can be obtained from the official website at https://nodejs.org.

Similarly, a minimum version of PostgreSQL 9.1 is necessary due to the usage of the `ON DELETE CASCADE` feature. Again, it is recommended to use the latest LTS version of PostgreSQL, which can be downloaded from the official website at https://www.postgresql.org/.

Once you have Node.js and PostgreSQL installed, type this in the terminal to install the following required dependencies for the project:

```bash
npm install
```

| Dependency    | Recommended Version | Description                                                                 |
| ------------- | ------------------- | --------------------------------------------------------------------------- |
| Node.js       | 18.13.0             | JavaScript runtime for the backend.                                         |
| Express       | 4.18.2              | A web framework for Node.js.                                                |
| PostgreSQL    | 14.6                | A powerful, open-source object-relational database system.                  |
| dotenv        | 16.0.0              | A zero-dependency module that loads environment variables from a .env file. |
| supertest     | 6.3.3               | A library for testing Node.js HTTP servers.                                 |
| husky         | 8.0.2               | A library for specifying git hooks in package.json.                         |
| jest          | 27.5.1              | A JavaScript testing framework.                                             |
| jest-extended | 2.0.0               | Additional Jest matchers.                                                   |
| pg            | 8.9.0               | Non-blocking PostgreSQL client for Node.js.                                 |
| pg-format     | 1.0.4               | A library for formatting PostgreSQL queries.                                |

## 4. Setup and seed the database

The PostgreSQL database will require seeding.

Seeding a database refers to the process of adding initial data to a newly created or an empty database. The data added is called seed data and is similar to what the the application will eventually use. There are two scripts that firstly create the tables for the database, and then populate it with data. You can run these commands again to reset the database data.

Type the following in the terminal:

```bash
npm run setup-dbs
```

```bash
npm run seed
```

## 5. Start the application

To start the application on the default port 9090, type the following in the terminal:

```bash
npm start
```

## 6. Routes

Using an application such as [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) you can query the database.

If you have setup the project locally, you can use the address http://localhost:9090/ along with the route.

The application is also deployed online using Render at the address https://nc-news-6g30.onrender.com/api.

| Route                                   | Description                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET /api                                | Get a list of all the avaiable API endpoints, their description, and any relevant example responses.                                                                                                                                                                                                                                                                              |
| GET /api/topics                         | Retrieves an array of all the available topics in the database, each in the form of an object with keys `slug` and `description`.                                                                                                                                                                                                                                                 |
| GET /api/users                          | Retrieves an array of all registered users in the database, each in the form of an object with keys `username`, `name` and `avatar_url`.                                                                                                                                                                                                                                          |
| GET /api/users/:username                | Retrieves a single user by its `username`. Returns an object with the properties `username`, `name` and `avatar_url`.                                                                                                                                                                                                                                                             |
| GET /api/articles                       | Retrieves a collection of all available articles from the API. <br />It is possible to filter articles by multiple topics by separating them with a comma in the query string. <br />It also returns a `total_count` property which is a count of all articles related to the search. <br />Please see section 6.1 for a table on the query parameters, as there are quite a few. |
| GET /api/articles/:article_id           | Retrieves a single article by its `article_id`. The `article_id` must be passed as an integer. <br />Optional paramaters include <br />`limit` : Number of comments to return per page (default: 10) <br />`p` : Page number to start from (default: 1)                                                                                                                           |
| GET /api/articles/:article_id/comments  | Retrieves an array of all comments assigned to the specified `article_id`. The `article_id` parameter must be passed as an integer.                                                                                                                                                                                                                                               |
| POST /api/articles/:article_id/comments | Posts a new comment to the database. The `article_id` must be passed as an integer, and the `username` must match an existing user in the database. The new comment is returned.                                                                                                                                                                                                  |
| POST /api/articles                      | Posts a new article to the database. <br />The `author` must already exist in the database (username). <br />The `topic` must already exist in the database. <br />If `article_img_url` is empty a default one will be used. If a custom `article_img_url` is used it must be a valid, hosted image with a GET status 200. <br />The `body` and `title` must not be empty.        |
| POST /api/topics                        | Posts a new topic to the database. The topic must not already exist in the database. <br />The endpoint expects a JSON object with a body containing the new topic's `slug` and `description` properties. If successfully created, the new topic is returned.                                                                                                                     |
| PATCH /api/articles/:article_id         | Updates the vote value of an existing article. The `article_id` must be passed as an integer. The updated article is returned.                                                                                                                                                                                                                                                    |
| PATCH /api/comments/:comment_id         | Updates the vote value of an existing comment. The `comment_id` must be passed as an integer. The updated comment is returned.                                                                                                                                                                                                                                                    |
| DELETE /api/comments/:comment_id        | Deletes a single comment by its `comment_id`. The `comment_id` parameter must be passed as an integer.                                                                                                                                                                                                                                                                            |
| DELETE /api/articles/:article_id        | Deletes a single article by its `article_id`. Any corresponding comments will also be deleted. The `article_id` parameter must be passed as an integer.                                                                                                                                                                                                                           |

<br />

### 6.1 GET /api/articles query parameters

| Query   | Options                                                   | Default    |
| ------- | --------------------------------------------------------- | ---------- |
| sort_by | article_id, title, topic, author, body, created_at, votes | created_at |
| order   | asc, desc                                                 | desc       |
| topic   | topic OR topic1,topic2,topic3                             | all topics |
| limit   | Any integer 1 to 50                                       | 10         |
| p       | Any integer 1 and above                                   | 1          |

<br />

## 7. Example Usage

### Retrieve all topics:

```
GET https://nc-news-6g30.onrender.com/api/topics
```

### Response:

```
status: 200 OK

{
	"topics": [
		{
			"slug": "coding",
			"description": "Code is love, code is life"
		},
		{
			"slug": "football",
			"description": "FOOTIE!"
		},
		{
			"slug": "cooking",
			"description": "Hey good looking, what you got cooking?"
		}
	]
}
```

### Retrieve all articles related to a topic, sorted by article_id in ascending order:

```
GET https://nc-news-6g30.onrender.com/api/articles?topic=cooking&sort_by=article_id&order=asc
```

### Response:

<br />

<details><summary>Expand me</summary>

```
status: 200 OK

{
	"articles": [
		{
			"author": "weegembump",
			"title": "Sweet potato & butternut squash soup with lemon & garlic toast",
			"article_id": 25,
			"topic": "cooking",
			"created_at": "2020-03-11T21:16:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=700&h=700",
			"comment_count": 4
		},
		{
			"author": "weegembump",
			"title": "HOW COOKING HAS CHANGED US",
			"article_id": 26,
			"topic": "cooking",
			"created_at": "2020-04-06T00:00:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?w=700&h=700",
			"comment_count": 11
		},
		{
			"author": "grumpy19",
			"title": "Thanksgiving Drinks for Everyone",
			"article_id": 27,
			"topic": "cooking",
			"created_at": "2020-01-24T23:22:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?w=700&h=700",
			"comment_count": 13
		},
		{
			"author": "happyamy2016",
			"title": "High Altitude Cooking",
			"article_id": 28,
			"topic": "cooking",
			"created_at": "2020-01-04T00:24:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?w=700&h=700",
			"comment_count": 5
		},
		{
			"author": "tickle122",
			"title": "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
			"article_id": 29,
			"topic": "cooking",
			"created_at": "2020-01-06T20:12:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/357743/pexels-photo-357743.jpeg?w=700&h=700",
			"comment_count": 10
		},
		{
			"author": "jessjelly",
			"title": "Twice-Baked Butternut Squash Is the Thanksgiving Side Dish of Your Dreams",
			"article_id": 30,
			"topic": "cooking",
			"created_at": "2020-01-11T20:20:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/175753/pexels-photo-175753.jpeg?w=700&h=700",
			"comment_count": 8
		},
		{
			"author": "tickle122",
			"title": "What to Cook This Week",
			"article_id": 31,
			"topic": "cooking",
			"created_at": "2020-06-09T02:19:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/349609/pexels-photo-349609.jpeg?w=700&h=700",
			"comment_count": 12
		},
		{
			"author": "grumpy19",
			"title": "Halal food: Keeping pure and true",
			"article_id": 32,
			"topic": "cooking",
			"created_at": "2020-06-18T20:08:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/954677/pexels-photo-954677.jpeg?w=700&h=700",
			"comment_count": 5
		},
		{
			"author": "weegembump",
			"title": "Seafood substitutions are increasing",
			"article_id": 33,
			"topic": "cooking",
			"created_at": "2020-09-16T16:26:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?w=700&h=700",
			"comment_count": 6
		},
		{
			"author": "grumpy19",
			"title": "The Notorious MSG’s Unlikely Formula For Success",
			"article_id": 34,
			"topic": "cooking",
			"created_at": "2020-11-22T11:13:00.000Z",
			"votes": 0,
			"article_img_url": "https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700",
			"comment_count": 11
		}
	],
	"total_count": 12
}

```

</details>

<br />

## 8. Additional Information

### 8.1. Tests

The endpoints on the application have been built using test driven development, using test data, seeded into a test database of the same design as the production database. The tests file is in the \_\_tests\_\_ directory, and you can run this by typing the following in the terminal:

```bash
npm test
```

### 8.2. Created by

Jim Jenkinson [Github @Superjim](https://github.com/Superjim/)
