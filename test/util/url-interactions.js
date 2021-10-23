const chai = require('chai');
const util = require('../../dist/util.js');

const noProtocol = [
  'bbc.co.uk',
  'google.com/robots.txt',
  'chaijs.com/api/bdd/',
  'www.reddit.com/r/news',
  'example.com/example/example.html',
];
const hasNonHttpProtocol = [
  'mailto://test@test.com',
  'ftp://usr:password@ftp.test.com/dir/file.txt',
  'skype://echo123?call',
  'magnet:?xt=urn:btih.org%3a6',
  'testApp://home',
];
const hasHttpsProtocol = [
  'https://en.wikipedia.org/wiki/File_Transfer_Protocol',
  'https://letsencrypt.org/getting-started/',
  'https://github.com/ChrisAkroyd/robots-txt-parser',
  'https://www.reddit.com/r/news/',
  'https://bcc.nl',
];

const { expect } = chai;

describe('url-interaction', () => {
  describe('has-http-protocol', () => {
    it('Expect all links to have a http protocol.', () => {
      hasHttpsProtocol.forEach((link) => {
        const { protocol } = new URL(link);
        expect(util.hasHttpProtocol(protocol)).to.be.true;
      });

      hasHttpsProtocol.forEach((link) => {
        const { protocol } = new URL(link);
        expect(util.hasHttpProtocol(protocol)).to.be.true;
      });
    });

    it('Expect all links to not have http protocol.', () => {
      hasNonHttpProtocol.forEach((link) => {
        try {
          const { protocol } = new URL(link);
          expect(util.hasHttpProtocol(protocol)).to.be.false;
        } catch (e) {
          expect(util.hasHttpProtocol('')).to.be.false;
        }
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
