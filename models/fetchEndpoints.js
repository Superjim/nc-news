const fs = require("fs/promises");
const path = require("path");

const endpointsPath = path.resolve(__dirname, "..", "endpoints.json");

//This function returns endpoints.json as an object
const fetchEndpoints = async () => {
  const endpoints = await fs.readFile(endpointsPath, "utf-8");
  return JSON.parse(endpoints);
};

module.exports = { fetchEndpoints };
