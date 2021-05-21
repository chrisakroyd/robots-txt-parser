const chai = require('chai');
const exampleRobotsMalformed = require('../test-data/example-robots-malformed-short.js');
const parse = require('../../src/parser.js');

const { expect } = chai;

describe('Ignores Malformed Values', () => {
  const parseResult = parse(exampleRobotsMalformed);
  const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');

  it('Should have 3 sitemaps.', () => {
    expect(parseResult.sitemaps).to.have.lengthOf(3);
  });

  it('Expect there to be one user agent.', () => {
    expect(userAgents).to.have.lengthOf(1);
  });

  it('Expect the only user agent record to be valid.', () => {
    userAgents.forEach((userAgent) => {
      const userAgentGroup = parseResult[userAgent];
      expect(userAgentGroup).to.be.an('object');
      expect(userAgentGroup).to.contain.all.keys(['allow', 'disallow', 'crawlDelay']);
    });
  });

  it('Expect the only user agent to have the correct number of records.', () => {
    const botGroup = parseResult[userAgents[0]];
    expect(botGroup.allow).to.have.lengthOf(1);
    expect(botGroup.disallow).to.have.lengthOf(1);
    expect(botGroup.crawlDelay).to.equal(89);
  });
});
