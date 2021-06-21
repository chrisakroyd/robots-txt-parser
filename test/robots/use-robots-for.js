const chai = require('chai');
const robots = require('../../src/index.js');

const { expect } = chai;
const robotsParser = robots();

describe('use-robots-for', () => {
  it('Expect robots.txt to call callback (.useRobotsFor(link))', (done) => {
    expect(robotsParser.useRobotsFor('http://google.co.uk', () => done()));
  });
});
