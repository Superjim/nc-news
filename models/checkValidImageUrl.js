const request = require("supertest");

//This function checks if a url is a valid image by making a GET request using supertest. If it doesnt have the Content-Type header of image, or doesnt return status 200 OK, it will throw an error.
async function checkValidImageUrl(url) {
  try {
    await request(url)
      .get(url)
      .expect("Content-Type", /^image\//)
      .expect(200);
  } catch (err) {
    // throw an error 400 if it fails
    throw { status: 400, msg: `Invalid request: ${url} is not an image` };
  }
}

module.exports = { checkValidImageUrl };
