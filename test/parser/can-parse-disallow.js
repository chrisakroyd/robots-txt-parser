const chai = require('chai');
const disallowRobots = require('../test-data/example-robots-txt-disallow.js');
const parse = require('../../src/parser.js');

const { expect } = chai;

describe('all-disallow', () => {
  const parseResult = parse(disallowRobots);
  it('* should only have disallow records.', () => {
    const botGroup = parseResult['*'];
    const allowList = botGroup.allow;
    const disallowList = botGroup.disallow;
    expect(allowList).to.be.instanceOf(Array);
    expect(allowList).to.have.lengthOf(0);
    expect(disallowList).to.be.instanceOf(Array);
    expect(disallowList).to.have.lengthOf(19);
  });

  it('Each disallow record should be valid.', () => {
    const disallowList = parseResult['*'].disallow;
    disallowList.forEach((disallowRecord) => {
      expect(disallowRecord.specificity).to.be.a('Number');
      expect(disallowRecord.path).to.be.instanceOf(RegExp);
    });
  });
});
