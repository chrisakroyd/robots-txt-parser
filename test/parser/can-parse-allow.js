const chai = require('chai');
const allowRobots = require('../test-data/example-robots-txt-allow.js');
const parse = require('../../src/parser.js');

const { expect } = chai;

describe('all-allow', () => {
  const parseResult = parse(allowRobots);
  it('* should only have allow records.', () => {
    const botGroup = parseResult['*'];
    const allowList = botGroup.allow;
    const disallowList = botGroup.disallow;
    expect(allowList).to.be.instanceOf(Array);
    expect(allowList).to.have.lengthOf(6);
    expect(disallowList).to.be.instanceOf(Array);
    expect(disallowList).to.have.lengthOf(0);
  });

  it('Each allow record should be valid.', () => {
    const allowList = parseResult['*'].allow;
    allowList.forEach((allowRecord) => {
      expect(allowRecord.specificity).to.be.a('Number');
      expect(allowRecord.path).to.be.instanceOf(RegExp);
    });
  });
});
