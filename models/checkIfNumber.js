const checkIfNumber = (input) => {
  if (isNaN(input)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid request: ${input} is not a number`,
    });
  }
};

module.exports = { checkIfNumber };
