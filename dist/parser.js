"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt
// Constants for groupings
var USER_AGENT = 'user-agent';
var ALLOW = 'allow';
var DISALLOW = 'disallow';
var SITEMAP = 'sitemap';
var CRAWL_DELAY = 'crawl-delay';
var HOST = 'host';
// Regex's for cleaning up the file.
var comments = /#.*$/gm;
var whitespace = ' ';
var lineEndings = /[\r\n]+/g;
var recordSlices = /(\w+-)?\w+:\s\S*/g;
// Replace comments and whitespace
var cleanComments = function (rawString) { return rawString.replace(comments, ''); };
var cleanSpaces = function (rawString) {
    return rawString.replace(whitespace, '').trim();
};
var splitOnLines = function (string) { return string.split(lineEndings); };
var robustSplit = function (string) {
    var _a;
    return !string.includes('<html>')
        ? __spreadArray([], ((_a = string.match(recordSlices)) !== null && _a !== void 0 ? _a : []), true).map(cleanSpaces)
        : [];
};
var parseRecord = function (line) {
    // Find first colon and assume is the field delimiter.
    var firstColonI = line.indexOf(':');
    return {
        // Fields are non-case sensitive, therefore lowercase them.
        field: line.slice(0, firstColonI).toLowerCase().trim(),
        // Values are case sensitive (e.g. urls) and therefore leave alone.
        value: line.slice(firstColonI + 1).trim(),
    };
};
var parsePattern = function (pattern) {
    var regexSpecialChars = /[-[\]/{}()+?.\\^$|]/g;
    var wildCardPattern = /\*/g;
    var EOLPattern = /\\\$$/;
    var flags = 'm';
    var regexString = pattern
        .replace(regexSpecialChars, '\\$&')
        .replace(wildCardPattern, '.*')
        .replace(EOLPattern, '$');
    return new RegExp(regexString, flags);
};
var groupMemberRecord = function (value) { return ({
    specificity: value.length,
    path: parsePattern(value),
}); };
var parser = function (rawString) {
    var lines = splitOnLines(cleanSpaces(cleanComments(rawString)));
    // Fallback to the record based split method if we find only one line.
    if (lines.length === 1) {
        lines = robustSplit(cleanComments(rawString));
    }
    var robotsObj = {
        sitemaps: [],
    };
    var agent = '';
    lines.forEach(function (line) {
        var record = parseRecord(line);
        var recordValue = record.value.toLowerCase();
        switch (record.field) {
            case USER_AGENT:
                if (recordValue !== agent && recordValue.length > 0) {
                    // Bot names are non-case sensitive.
                    agent = recordValue;
                    robotsObj[agent] = {
                        allow: [],
                        disallow: [],
                        crawlDelay: 0,
                    };
                }
                else if (recordValue.length === 0) {
                    // Malformed user-agent, ignore its rules.
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
                if (!robotsObj.host) {
                    robotsObj.host = record.value;
                }
                break;
            default:
                break;
        }
    });
    // Return only unique sitemaps.
    robotsObj.sitemaps = robotsObj.sitemaps.filter(function (val, i, s) { return s.indexOf(val) === i; });
    return robotsObj;
};
module.exports = parser;
