const get = require('simple-get');

function getRobots(getUrl) {
  return new Promise((resolve, reject) => {
    get.concat(getUrl, (error, response, body) => {
      if (!error) {
        resolve(body.toString());
      } else {
        reject(error);
      }
    });
  });
}

module.exports = getRobots;
