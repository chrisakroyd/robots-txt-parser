const chai = require('chai');
const util = require('../../src/util.js');

const { expect } = chai;

const links = [
  {
    string: 'example.com/news/search',
    result: 'http://example.com',
  }, {
    string: 'test1.com',
    result: 'http://test1.com',
  }, {
    string: 'test2.com',
    result: 'http://test2.com',
  }, {
    string: 'test3.com',
    result: 'http://test3.com',
  }, {
    string: 'https://bbc.com/news',
    result: 'https://bbc.com',
  }, {
    string: 'ftp://test.com/news',
    result: 'http://test.com',
  }, {
    string: 'mailto:someone@example.com',
    result: 'http://example.com',
  }, {
    string: 'fakeaddress.de',
    result: 'http://fakeaddress.de',
  }, {
    string: 'cheese.nl',
    result: 'http://cheese.nl',
  }, {
    string: 'mailto:someone@example.co.uk',
    result: 'http://example.co.uk',
  }, {
    string: 'https://cheese.nl',
    result: 'https://cheese.nl',
  },
];

describe('format-link', () => {
  links.forEach((data) => {
    it(`Expect ${data.string} to equal ${data.result} after formatting.`, () => {
      expect(util.formatLink(data.string)).to.equal(data.result);
    });
  });

  it('Expect multiple formats to not modify the result.', () => {
    links.forEach((data) => {
      expect(util.formatLink(util.formatLink(data.string))).to.equal(data.result);
    });
  });
});
