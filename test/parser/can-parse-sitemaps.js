const chai = require('chai');
const uniq = require('lodash/uniq');
const sitemaps = require('../test-data/example-robots-txt-sitemaps');
const parse = require('../../src/parser.js');

const { expect } = chai;

describe('can-parse-sitemaps', () => {
  const parseResult = parse(sitemaps);
  it('Expect parse result to have a sitemaps list.', () => {
    // Sitemap must be correctly formatted, for this test we don't care about any .
    expect(parseResult).to.contain.any.keys(['sitemaps']);
    expect(parseResult.sitemaps).to.not.be.empty;
  });

  it('Expect the sitemaps list to contain only sitemaps in the robots file.', () => {
    const sitemapsList = ['http://www.bbc.co.uk/news_sitemap.xml', 'http://www.bbc.co.uk/video_sitemap.xml',
      'http://www.bbc.co.uk/sitemap.xml', 'http://www.bbc.co.uk/mobile_sitemap.xml'];
    expect(parseResult.sitemaps).to.have.same.members(sitemapsList);
  });

  it('Sitemaps in the sitemaps list should be unique.', () => {
    expect(parseResult.sitemaps).to.deep.equal(uniq(parseResult.sitemaps));
  });

  it('Each sitemap should be a string.', () => {
    parseResult.sitemaps.forEach((sitemap) => {
      expect(sitemap).to.be.a('string');
    });
  });
});
