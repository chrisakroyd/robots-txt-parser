const chai = require('chai');
const robots = require('../../src/index.js');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');

const { expect } = chai;
const robotsParser = robots();

describe('get-crawlable-links-sync', () => {
  robotsParser.parseRobots('http://example.com', exampleRobotsShort);

  it('Expect that an array is returned.', () => {
    expect(robotsParser.getCrawlableLinksSync(['/test/news', '/test/more-news'])).to.be.an('array');
  });
});

describe('get-crawlable-links-async', () => {
  it('Should return a promise.', () => {
    expect(robotsParser.getCrawlableLinks(['/test/news', '/test/more-news'])).to.be.an.instanceOf(Promise);
  });

  it('Should call the callback.', (done) => {
    expect(robotsParser.getCrawlableLinks(['/test/news', '/test/more-news'], () => done()));
  });
});
