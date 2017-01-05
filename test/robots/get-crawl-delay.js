const chai = require('chai');
const robots = require('../../src/index.js');
const parser = require('../../src/parser.js');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');

const expect = chai.expect;
const robotsParser = robots();

describe('get-crawl-delay', () => {
  const parsedRobots = parser(exampleRobotsShort);
  const userAgents = Object.keys(parsedRobots).filter(val => val !== 'sitemaps');
  robotsParser.parseRobots('http://example.com', exampleRobotsShort);

  it('Expect each user agent to have a valid crawl delay.', () => {
    userAgents.forEach((agent) => {
      robotsParser.setUserAgent(agent);
      expect(robotsParser.getCrawlDelaySync()).to.be.above(0);
    });
  });
});
