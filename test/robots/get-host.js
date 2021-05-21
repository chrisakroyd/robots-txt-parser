const chai = require('chai');
const robots = require('../../src/index.js');
const exampleRobotsShort = require('../test-data/example-robots-txt-short.js');

const { expect } = chai;
const robotsParser = robots();

describe('get-host', () => {
  robotsParser.parseRobots('http://example.com', exampleRobotsShort);

  it('Expect that the correct host is returned.', () => {
    expect(robotsParser.getPreferredHostSync()).to.be.an('string');
  });
});

describe('get-sitemaps-async', () => {
  it('Should return a promise.', () => {
    expect(robotsParser.getPreferredHost()).to.be.an.instanceOf(Promise);
  });

  it('Should call the callback.', (done) => {
    expect(robotsParser.getPreferredHost(() => done()));
  });
});
