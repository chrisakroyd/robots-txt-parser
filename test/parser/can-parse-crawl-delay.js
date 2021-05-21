const chai = require('chai');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');
const parse = require('../../src/parser.js');

const { expect } = chai;

describe('can-parse-crawl-delays', () => {
  const parseResult = parse(exampleRobotsShort);
  const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
  it('Expect no top-level crawlDelay key', () => {
    expect(parseResult).to.not.have.property('crawlDelay');
  });

  it('Expect there to be multiple user agent strings.', () => {
    expect(userAgents).to.have.length.above(0);
  });

  it('Expect each user agent record to have a non-zero crawl delay', () => {
    userAgents.forEach((userAgent) => {
      const userAgentGroup = parseResult[userAgent];
      expect(userAgentGroup).to.be.an('object');
      expect(userAgentGroup).to.contain.all.keys(['crawlDelay']);
      expect(userAgentGroup.crawlDelay).to.be.above(0);
    });
  });
});
