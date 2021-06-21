const chai = require('chai');
const robots = require('../../src/index.js');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');

const { expect } = chai;
const robotsParser = robots();

const cachedLinks = ['http://example.com', 'http://test.com', 'https://www.bbc.co.uk', 'https://google.co.uk'];
const nonCachedLinks = ['example-test.com', 'http://test-example.com', 'https://reddit.com'];

describe('is-cached', () => {
  cachedLinks.forEach((link) => {
    robotsParser.parseRobots(link, exampleRobotsShort);
  });

  it('Expect a robots.txt to be cached for all links.', () => {
    cachedLinks.forEach((link) => {
      expect(robotsParser.isCached(link)).to.be.true;
    });
  });

  it('Expect robots.txt not to be cached for all links.', () => {
    nonCachedLinks.forEach((link) => {
      expect(robotsParser.isCached(link)).to.be.false;
    });
  });

  it('Expect robots.txt crawl to use cached copy (.useRobotsFor(link))', (done) => {
    expect(robotsParser.useRobotsFor('http://example.com', done));
  });
});

describe('clear-cache', () => {
  cachedLinks.forEach((link) => {
    robotsParser.parseRobots(link, exampleRobotsShort);
  });

  it('Expect a robots.txt to be cached for all links.', () => {
    cachedLinks.forEach((link) => {
      expect(robotsParser.isCached(link)).to.be.true;
    });
  });

  it('Expect a robots.txt to no longer be cached.', () => {
    robotsParser.clearCache();
    cachedLinks.forEach((link) => {
      expect(robotsParser.isCached(link)).to.be.false;
    });
  });
});
