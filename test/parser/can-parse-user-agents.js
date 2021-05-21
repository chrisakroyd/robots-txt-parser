const chai = require('chai');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');
const parse = require('../../src/parser.js');

const { expect } = chai;

describe('can-parse-user-agents', () => {
  const parseResult = parse(exampleRobotsShort);
  const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
  it('Expect there to be multiple user agent strings.', () => {
    expect(userAgents).to.have.length.above(0);
  });

  it('Expect each user agent record to exist and be valid.', () => {
    userAgents.forEach((userAgent) => {
      const userAgentGroup = parseResult[userAgent];
      expect(userAgentGroup).to.be.an('object');
      expect(userAgentGroup).to.contain.all.keys(['allow', 'disallow', 'crawlDelay']);
    });
  });
});
