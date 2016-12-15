const request = require('request');

function get(getUrl) {
  return new Promise((resolve, reject) => {
    request.get(getUrl, (error, response, body) => {
      if (!error) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = get;
