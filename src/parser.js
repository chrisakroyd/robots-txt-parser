// https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt
// Constants for groupings
const USER_AGENT = 'user-agent';
const ALLOW = 'allow';
const DISALLOW = 'disallow';
const SITEMAP = 'sitemap';
const CRAWL_DELAY = 'crawl-delay';
// Regex's for cleaning up the file.
const comments = /#.*$/gm;
const whitespace = ' ';
const lineEndings = /[\r\n]+/g;

function cleanString(rawString) {
  let lines = rawString;
  // Replace comments and whitespace
  lines = lines.replace(comments, '');
  lines = lines.replace(whitespace, '');
  lines = lines.trim();
  return lines;
}

function splitOnLines(string) {
  return string.split(lineEndings);
}

function parseRecord(line) {
  // Find first colon and assume is the field delimiter.
  const firstColonI = line.indexOf(':');
  return {
    // Fields are non-case sensitive, therefore lowercase them.
    field: line.slice(0, firstColonI).toLowerCase().trim(),
    // Values are case sensitive (e.g. urls) and therefore leave alone.
    value: line.slice(firstColonI + 1).trim(),
  };
}

function parsePattern(pattern) {
  const regexSpecialChars = /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g;
  const wildCardPattern = /\*/g;
  const EOLPattern = /\\\$$/;
  const flags = 'm';

  const regexString = pattern
    .replace(regexSpecialChars, '\\$&')
    .replace(wildCardPattern, '.*')
    .replace(EOLPattern, '$');

  return new RegExp(regexString, flags);
}

function groupMemberRecord(value) {
  return {
    specificity: value.length,
    path: parsePattern(value),
  };
}


function parser(rawString) {
  const lines = splitOnLines(cleanString(rawString));
  const robotsObj = {
    sitemaps: [],
  };
  let agent = '';
  lines.forEach((line) => {
    const record = parseRecord(line);
    switch (record.field) {
      case USER_AGENT:
        // Bot names are non-case sensitive.
        agent = record.value = record.value.toLowerCase();
        if (agent.length > 0) {
          robotsObj[agent] = {
            allow: [],
            disallow: [],
            crawlDelay: 0,
          };
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
      // @TODO test crawl delay parameter.
      case CRAWL_DELAY:
        if (agent.length > 0) {
          robotsObj[agent].crawlDelay = Number.parseInt(record.value, 10);
        }
        break;
      default:
        break;
    }
  });
  // Return only unique sitemaps.
  robotsObj.sitemaps = robotsObj.sitemaps.filter((val, i, s) => s.indexOf(val) === i);
  return robotsObj;
}

module.exports = parser;
