const chai = require('chai');
const exampleShort = require('../test-data/example-robots-txt-short');
const parse = require('../../src/parser');

const { expect } = chai;

describe('correct-parse-formatting.', () => {
  const parseResult = parse(exampleShort);
  it('Should have one user agent, * and a sitemaps list.', () => {
    expect(parseResult).to.contain.all.keys(['*', 'sitemaps']);
    expect(parseResult.sitemaps).to.have.lengthOf(5);
  });
});
