const url = require('fast-url-parser');
const isAbsolute = require('is-absolute-url');

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

function applyRecords(path, records) {
  const recordTests = records.map(record => (
    {
      applies: record.path.test(path),
      specificity: record.specificity,
    }
  ));
  // Return only the records which apply to this path.
  return recordTests.filter((record => record.applies));
}

function maxSpecificity(records) {
  const specificity = records.map(record => record.specificity);
  return Math.max(...specificity);
}

module.exports = {
  hasHttpProtocol,
  addProtocol,
  formatLink,
  applyRecords,
  maxSpecificity,
};
