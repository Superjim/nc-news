const database = require("../db/connection");

//This helper function checks if a user exists in the database, and checks if they should exist or not by an optional parameter shouldUserExist
//If you just want to check if a user exists, and they should exist, eg. for posting a comment / article, just pass in the username
//If you want to check the user doesnt exist, pass in second parameter false, eg, for creating a new user

const checkUserExists = async (username, userShouldExist = true) => {
  //check user exists in database
  const user = await database.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  //if the user doesnt exist, but the user should exist, throw an error
  if (user.rows.length === 0 && userShouldExist === true) {
    throw {
      status: 404,
      msg: `Username ${username} not found in database`,
    };
    //if the user doesnt exist, and the user should not exist, return true
  } else if (user.rows.length === 0 && userShouldExist === false) {
    return true;
    //if the user does exist, and the user should exist, return true
  } else if (user.rows.length > 0 && userShouldExist === true) {
    return true;
    //if the user does exist, but the user should not exist, throw error
  } else if (user.rows.length > 0 && userShouldExist === false) {
    throw {
      status: 400,
      msg: `Username ${username} should not exist in the database`,
    };
  }
};
module.exports = { checkUserExists };
