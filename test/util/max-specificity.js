const chai = require('chai');
const util = require('../../src/util/util.js');
const maxBy = require('lodash/maxBy');
const parsedRobots = require('../test-data/example-parsed-robots-short.js');

const expect = chai.expect;

describe('max-specificity', () => {
  const userAgents = Object.keys(parsedRobots).filter(val => val !== 'sitemaps');

  userAgents.forEach((agent) => {
    describe(agent, () => {
      const botGroup = parsedRobots[agent];
      const allowMax = maxBy(botGroup.allow, 'specificity').specificity;
      const disallowMax = maxBy(botGroup.disallow, 'specificity').specificity;
      it(`Expect the max specificity for allow to be ${allowMax}`, () => {
        expect(util.maxSpecificity(botGroup.allow)).to.equal(allowMax);
      });

      it(`Expect the max specificity for disallow to be ${disallowMax}`, () => {
        expect(util.maxSpecificity(botGroup.disallow)).to.equal(disallowMax);
      });
    });
  });
});
