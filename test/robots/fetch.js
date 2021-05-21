const chai = require('chai');
const robots = require('../../src/index.js');

const { expect } = chai;
const robotsParser = robots();

describe('fetch', () => {
  const links = ['bbc.co.uk', 'guardian.co.uk', 'gov.uk', 'https://www.npmjs.com/', 'www.github.com'];

  it('Expect to be able to retrieve and parse a random selection of websites robots.txt', () => {
    links.forEach((link) => {
      robotsParser.fetch(link).then((test) => {
        expect(Object.keys(test)).to.be.greaterThan(2);
      });
    });
  });
});
