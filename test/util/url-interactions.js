const chai = require('chai');
const url = require('fast-url-parser');
const util = require('../../src/util.js');

const noProtocol = ['bbc.co.uk', 'google.com/robots.txt', 'chaijs.com/api/bdd/', 'www.reddit.com/r/news',
  'example.com/example/example.html'];
const hasNonHttpProtocol = ['mailto://test@test.com', 'ftp://usr:password@ftp.test.com/dir/file.txt',
  'skype://echo123?call', 'magnet:?xt=urn:btih.org%3a6', 'testApp://home'];
const hasHttpProtocol = ['http://store.steampowered.com/', 'http://bbc.co.uk/news/test',
  'http://chaijs.com/api/bdd/#method_property', 'http://www.robotstxt.org/meta.html'];
const hasHttpsProtocol = ['https://en.wikipedia.org/wiki/File_Transfer_Protocol',
  'https://letsencrypt.org/getting-started/', 'https://github.com/ChrisAkroyd/robots-txt-parser',
  'https://www.reddit.com/r/news/', 'https://bcc.nl'];

const { expect } = chai;

describe('url-interaction', () => {
  describe('has-protocol', () => {
    it('Expect links to not have a protocol.', () => {
      noProtocol.forEach((link) => {
        const { protocol } = url.parse(link);
        expect(util.hasHttpProtocol(protocol)).to.be.false;
      });
    });
  });

  describe('has-http-protocol', () => {
    it('Expect all links to have a http protocol.', () => {
      hasHttpsProtocol.forEach((link) => {
        const { protocol } = url.parse(link);
        expect(util.hasHttpProtocol(protocol)).to.be.true;
      });

      hasHttpsProtocol.forEach((link) => {
        const { protocol } = url.parse(link);
        expect(util.hasHttpProtocol(protocol)).to.be.true;
      });
    });

    it('Expect all links to not have http protocol.', () => {
      hasNonHttpProtocol.forEach((link) => {
        const { protocol } = url.parse(link);
        expect(util.hasHttpProtocol(protocol)).to.be.false;
      });
      noProtocol.forEach((link) => {
        const { protocol } = url.parse(link);
        expect(util.hasHttpProtocol(protocol)).to.be.false;
      });
    });
  });

  describe('add-protocol', () => {
    it('Expect http:// to be added to links with no protocol.', () => {
      noProtocol.forEach((link) => {
        const linkWithProtocol = util.addProtocol(link);
        expect(linkWithProtocol).to.equal(`http://${link}`);
      });
    });
  });
});
