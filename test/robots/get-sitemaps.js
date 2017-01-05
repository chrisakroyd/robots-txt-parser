const chai = require('chai');
const robots = require('../../src/index.js');
const parser = require('../../src/parser.js');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');

const expect = chai.expect;
const robotsParser = robots();

describe('get-sitemaps', () => {
  const parsedRobots = parser(exampleRobotsShort);
  robotsParser.parseRobots('http://example.com', exampleRobotsShort);

  it('Expect all sitemaps to be valid and parsed for this robots.txt.', () => {
    const sitemaps = robotsParser.getSitemapsSync();
    expect(sitemaps).to.deep.equal(parsedRobots.sitemaps);
  });
});
