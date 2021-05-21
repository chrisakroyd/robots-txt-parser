const get = require('simple-get');

function getRobots(url, timeout) {
  return new Promise((resolve, reject) => {
    get.concat({ method: 'GET', url, timeout }, (error, response, body) => {
      if (!error) {
        resolve(body.toString());
      } else {
        reject(error);
      }
    });
  });
}

module.exports = getRobots;
