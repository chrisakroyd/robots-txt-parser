const url = require('fast-url-parser');
const isAbsolute = require('is-absolute-url');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function hasHttpProtocol(protocol) {
  return (protocol === 'http:' || protocol === 'https:');
}

function addProtocol(link) {
  return `http://${link}`;
}

function formatLink(rawLink) {
  let link = rawLink;
  // No protocol on the link, this can screw up url parsing with node url
  // so add a protocol and then parse.
  if (!isAbsolute(link)) {
    link = addProtocol(link);
  }
  const parsedLink = url.parse(link);

  // The protocol the link has is non-http, therefore we give it a http based protocol.
  if (!hasHttpProtocol(parsedLink.protocol)) {
    parsedLink.protocol = 'http:';
  }
  // Return the base link.
  return `${parsedLink.protocol}//${parsedLink.hostname}`;
}

/*
 * Calculates the number of records that apply for the
 * given path and the maximum specificity of all
 * the records which apply.
 */
function applyRecords(path, records) {
  let numApply = 0;
  let maxSpecificity = 0;

  for (let i = 0; i < records.length; i = i + 1) {
    const record = records[i];
    if (record.path.test(path)) {
      numApply = numApply + 1;
      if (record.specificity > maxSpecificity) {
        maxSpecificity = record.specificity;
      }
    }
  }

  return {
    numApply,
    maxSpecificity
  }
}

function createDirectories(filePath) {
  const resolvePath = path.resolve(filePath);
  const pathDir = path.dirname(resolvePath);

  return new Promise((resolve, reject) => {
    mkdirp(pathDir, (err, made) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  hasHttpProtocol,
  addProtocol,
  formatLink,
  applyRecords,
  createDirectories,
  writeFile,
  readFile,
};
