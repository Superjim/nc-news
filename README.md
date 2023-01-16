### To setup and run this project locally:

## 1. Clone this repository and open the directory

```
git clone https://github.com/Superjim/nc-news
```

```
cd nc-news
```

## 2. Create .env files

Create two .env files, .env.test and .env.development in the nc-news directory.

In the .env.test file, you should add the following line <PGDATABASE=PGDATABASE=nc_news_test>

In the .env.development file, add <PGDATABASE=PGDATABASE=nc_news>

## 3. Install dependencies

```
npm install
```

## 4. Setup and seed the database

```
npm run setup-dbs
```

```
npm run seed
```

## 5.
