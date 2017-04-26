const chai = require('chai');
const util = require('../../src/util.js');

const expect = chai.expect;

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
  },
];

describe('format-link', () => {
  links.forEach((data) => {
    it(`Expect ${data.string} to equal ${data.result} after formatting.`, () => {
      expect(util.formatLink(data.string)).to.equal(data.result);
    });
  });
});

