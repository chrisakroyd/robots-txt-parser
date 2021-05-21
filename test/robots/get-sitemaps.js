const chai = require('chai');
const robots = require('../../src/index.js');
const parser = require('../../src/parser.js');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');

const { expect } = chai;
const robotsParser = robots();

describe('get-sitemaps', () => {
  const parsedRobots = parser(exampleRobotsShort);
  robotsParser.parseRobots('http://example.com', exampleRobotsShort);

  it('Expect all sitemaps to be valid and parsed for this robots.txt.', () => {
    const sitemaps = robotsParser.getSitemapsSync();
    expect(sitemaps).to.deep.equal(parsedRobots.sitemaps);
  });
});

describe('get-sitemaps-async', () => {
  it('Should return a promise.', () => {
    expect(robotsParser.getSitemaps()).to.be.an.instanceOf(Promise);
  });

  it('Should call the callback.', (done) => {
    expect(robotsParser.getSitemaps(() => done()));
  });
});
