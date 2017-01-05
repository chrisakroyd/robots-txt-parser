const chai = require('chai');
const robots = require('../../src/index.js');
const parser = require('../../src/parser.js');
const testData = require('../test-data/can-crawl-test-data.js');

const expect = chai.expect;
const robotsParser = robots();

function getUserAgents(parsedRobots) {
  return Object.keys(parsedRobots).filter(val => val !== 'sitemaps');
}

describe('can-crawl ', () => {
  testData.forEach((data, i) => {
    const userAgents = getUserAgents(parser(data.robots));
    robotsParser.parseRobots(`test${i}.com`, data.robots);

    userAgents.forEach((agent) => {
      robotsParser.setUserAgent(agent);
      describe(`Running crawl tests for ${agent}.`, () => {
        data.matches.forEach((shouldMatch) => {
          it(`Expect ${shouldMatch} to be crawlable.`, () => {
            expect(robotsParser.canCrawlSync(shouldMatch)).to.be.true;
          });
        });

        data.nonMatch.forEach((nonMatch) => {
          it(`Expect ${nonMatch} to not be crawlable.`, () => {
            expect(robotsParser.canCrawlSync(nonMatch)).to.be.false;
          });
        });
      });
    });
  });
});
