// https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt
// Constants for groupings
const USER_AGENT = 'user-agent';
const ALLOW = 'allow';
const DISALLOW = 'disallow';
const SITEMAP = 'sitemap';
const CRAWL_DELAY = 'crawl-delay';
const HOST = 'host';
// Regex's for cleaning up the file.
const comments = /#.*$/gm;
const whitespace = ' ';
const lineEndings = /[\r\n]+/g;
const recordSlices = /(\w+-)?\w+:\s\S*/g;

// Replace comments and whitespace
const cleanComments = (rawString) => rawString.replace(comments, '');

const cleanSpaces = (rawString) => rawString.replace(whitespace, '').trim();

const splitOnLines = (string) => string.split(lineEndings);

const robustSplit = (string) => {
  return !string.includes('<html>') ? [...string.match(recordSlices)].map(cleanSpaces) : [];
};

const parseRecord = (line) => {
  // Find first colon and assume is the field delimiter.
  const firstColonI = line.indexOf(':');
  return {
    // Fields are non-case sensitive, therefore lowercase them.
    field: line.slice(0, firstColonI).toLowerCase().trim(),
    // Values are case sensitive (e.g. urls) and therefore leave alone.
    value: line.slice(firstColonI + 1).trim(),
  };
};

const parsePattern = (pattern) => {
  const regexSpecialChars = /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g;
  const wildCardPattern = /\*/g;
  const EOLPattern = /\\\$$/;
  const flags = 'm';

  const regexString = pattern
    .replace(regexSpecialChars, '\\$&')
    .replace(wildCardPattern, '.*')
    .replace(EOLPattern, '$');

  return new RegExp(regexString, flags);
};

const groupMemberRecord = (value) => (
  {
    specificity: value.length,
    path: parsePattern(value),
  });

const parser = (rawString) => {
  let lines = splitOnLines(cleanSpaces(cleanComments(rawString)));

  // Fallback to the record based split method if we find only one line.
  if (lines.length === 1) {
    lines = robustSplit(cleanComments(rawString));
  }

  const robotsObj = {
    sitemaps: [],
  };
  let agent = '';

  lines.forEach((line) => {
    const record = parseRecord(line);
    switch (record.field) {
      case USER_AGENT:
        const recordValue = record.value.toLowerCase();
        if (recordValue !== agent && recordValue.length > 0) {
          // Bot names are non-case sensitive.
          agent = recordValue;
          robotsObj[agent] = {
            allow: [],
            disallow: [],
            crawlDelay: 0,
          };
        } else if (recordValue.length === 0) { // Malformed user-agent, ignore its rules.
          agent = '';
        }
        break;
      // https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt#order-of-precedence-for-group-member-records
      case ALLOW:
        if (agent.length > 0 && record.value.length > 0) {
          robotsObj[agent].allow.push(groupMemberRecord(record.value));
        }
        break;
      case DISALLOW:
        if (agent.length > 0 && record.value.length > 0) {
          robotsObj[agent].disallow.push(groupMemberRecord(record.value));
        }
        break;
      // Non standard but support by google therefore included.
      case SITEMAP:
        if (record.value.length > 0) {
          robotsObj.sitemaps.push(record.value);
        }
        break;
      case CRAWL_DELAY:
        if (agent.length > 0) {
          robotsObj[agent].crawlDelay = Number.parseInt(record.value, 10);
        }
        break;
      // Non standard but included for completeness.
      case HOST:
        if (!('host' in robotsObj)) {
          robotsObj.host = record.value;
        }
        break;
      default:
        break;
    }
  });

  // Return only unique sitemaps.
  robotsObj.sitemaps = robotsObj.sitemaps.filter((val, i, s) => s.indexOf(val) === i);
  return robotsObj;
};

module.exports = parser;
