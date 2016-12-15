const url = require('url');

function hasProtocol(link) {
  return !!url.parse(link).protocol;
}

function hasHttpProtocol(link) {
  return link.indexOf('http') > -1 || link.indexOf('https') > -1;
}

function addProtocol(link) {
  return `http://${link}`;
}

function getHostname(link) {
  return url.parse(link).hostname;
}

function getProtocol(link) {
  return url.parse(link).protocol;
}

function formatLink(rawLink) {
  let link = getHostname(rawLink);
  // No protocol or the protocol the link has is non-http.
  if (!hasProtocol(rawLink) || !hasHttpProtocol(rawLink)) {
    link = addProtocol(link);
  } else {
    // Stick the protocol on the link, will be either http:// or https://
    link = `${getProtocol(rawLink)}//${link}`;
  }
  // Append the file we're interested in.
  return link;
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
  getHostname,
  getProtocol,
  hasProtocol,
  formatLink,
  applyRecords,
  maxSpecificity,
};
