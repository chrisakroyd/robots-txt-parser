const chai = require('chai');
const util = require('../../src/util/util.js');

const noProtocol = ['bbc.co.uk', 'google.com/robots.txt', 'chaijs.com/api/bdd/', 'www.reddit.com/r/news',
  'example.com/example/example.html'];
const hasNonHttpProtocol = ['mailto://test@test.com', 'ftp://usr:password@ftp.test.com/dir/file.txt',
  'skype://echo123?call', 'magnet:?xt=urn:btih.org%3a6', 'testApp://home'];
const hasHttpProtocol = ['http://store.steampowered.com/', 'http://bbc.co.uk/news/test',
  'http://chaijs.com/api/bdd/#method_property', 'http://www.robotstxt.org/meta.html'];
const hasHttpsProtocol = ['https://en.wikipedia.org/wiki/File_Transfer_Protocol',
  'https://letsencrypt.org/getting-started/', 'https://github.com/ChristopherAkroyd/robots-txt-parser',
  'https://www.reddit.com/r/news/'];

const hasProtocol = [].concat.apply(...[hasHttpProtocol, hasHttpsProtocol, hasNonHttpProtocol]);

const expect = chai.expect;

describe('url-interaction', () => {
  describe('has-protocol', () => {

    it('Expect links to not have a protocol.', () => {
      noProtocol.forEach((link) => {
        expect(util.hasHttpProtocol(link)).to.be.false;
      });
    });
  });

  describe('has-http-protocol', () => {
    it('Expect all links to have a http protocol.', () => {
      hasHttpsProtocol.forEach((link) => {
        expect(util.hasHttpProtocol(link)).to.be.true;
      });

      hasHttpsProtocol.forEach((link) => {
        expect(util.hasHttpProtocol(link)).to.be.true;
      });
    });

    it('Expect all links to not have http protocol.', () => {
      hasNonHttpProtocol.forEach((link) => {
        expect(util.hasHttpProtocol(link)).to.be.false;
      });
      noProtocol.forEach((link) => {
        expect(util.hasHttpProtocol(link)).to.be.false;
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

  describe('getRoboys-protocol', () => {
    it('Expect to successfully retrieve all protocols.', () => {
      hasProtocol.forEach((link) => {
        expect(util.getProtocol(link).length).to.be.above(0);
      });
    });

    it('Expect to not be able to retrieve a protocol.', () => {
      noProtocol.forEach((link) => {
        expect(util.getProtocol(link).length).to.equal(0);
      });
    });
  });

  describe('getRoboys-hostname', () => {
    it('Should retrieve a hostname for each link.', () => {
      hasProtocol.forEach((link) => {
        expect(util.getHostname(link).length).to.be.above(0);
      });
    });
  });
});
