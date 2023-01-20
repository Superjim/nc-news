const fs = require("fs/promises");
const path = require("path");

const endpointsPath = path.resolve(__dirname, "..", "endpoints.json");

//This function returns endpoints.json as an object
const fetchEndpoints = () => {
  return fs
    .readFile(endpointsPath, "utf-8")
    .then((endpoints) => JSON.parse(endpoints));
};

module.exports = { fetchEndpoints };
