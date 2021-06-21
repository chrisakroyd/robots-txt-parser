const get = require('simple-get');

const getRobots = (url, timeout) => new Promise((resolve, reject) => {
  get.concat({ method: 'GET', url, timeout }, (error, response, body) => {
    if (!error) {
      resolve(body.toString());
    } else {
      reject(error);
    }
  });
});

module.exports = getRobots;
