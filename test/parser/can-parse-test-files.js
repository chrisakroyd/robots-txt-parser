const chai = require('chai');
const exampleRobotsBBC = require('../test-data/example-robots-txt-bbc');
const exampleRobotsBcc = require('../test-data/example-robots-txt-bcc');
const exampleRobotsKarwei = require('../test-data/example-robots-txt-karwei');
const exampleRobotsShort = require('../test-data/example-robots-txt-short');
const exampleRobotsZalando = require('../test-data/example-robots-txt-zalando');
const parse = require('../../src/parser');

const { expect } = chai;

describe('can-parse-test-files', () => {
  it('Should completely parse robots-txt-bbc', () => {
    const parseResult = parse(exampleRobotsBBC);
    const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
    expect(userAgents).to.have.lengthOf(2);
    expect(parseResult).to.have.keys(['*', 'magpie-crawler', 'sitemaps']);
    expect(parseResult['*'].allow).to.have.lengthOf(0);
    expect(parseResult['*'].disallow).to.have.lengthOf(44);
    expect(parseResult['magpie-crawler'].allow).to.have.lengthOf(0);
    expect(parseResult['magpie-crawler'].disallow).to.have.lengthOf(1);
    expect(parseResult.sitemaps).to.have.lengthOf(10);
  });

  it('Should completely parse robots-txt-bcc', () => {
    const parseResult = parse(exampleRobotsBcc);
    const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
    expect(userAgents).to.have.lengthOf(1);
    expect(parseResult).to.have.keys(['*', 'sitemaps']);
    expect(parseResult['*'].allow).to.have.lengthOf(0);
    expect(parseResult['*'].disallow).to.have.lengthOf(20);
    expect(parseResult.sitemaps).to.have.lengthOf(6);
  });

  it('Should completely parse robots-txt-karwei', () => {
    const parseResult = parse(exampleRobotsKarwei);
    const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
    expect(userAgents).to.have.lengthOf(1);
    expect(parseResult).to.have.keys(['*', 'sitemaps']);
    expect(parseResult['*'].allow).to.have.lengthOf(0);
    expect(parseResult['*'].disallow).to.have.lengthOf(33);
    expect(parseResult.sitemaps).to.have.lengthOf(1);
  });

  it('Should completely parse robots-txt-short', () => {
    const parseResult = parse(exampleRobotsShort);
    const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
    expect(userAgents).to.have.lengthOf(3);
    expect(parseResult).to.have.keys(['*', 'longbot', 'morebot', 'sitemaps', 'host']);
    expect(parseResult['*'].allow).to.have.lengthOf(3);
    expect(parseResult['*'].disallow).to.have.lengthOf(2);
    expect(parseResult.morebot.allow).to.have.lengthOf(2);
    expect(parseResult.morebot.disallow).to.have.lengthOf(2);
    expect(parseResult.longbot.allow).to.have.lengthOf(3);
    expect(parseResult.longbot.disallow).to.have.lengthOf(1);
    expect(parseResult.sitemaps).to.have.lengthOf(5);
  });

  it('Should completely parse robots-txt-zalando', () => {
    const parseResult = parse(exampleRobotsZalando);
    const userAgents = Object.keys(parseResult).filter((val) => val !== 'sitemaps' && val !== 'host');
    expect(userAgents).to.have.lengthOf(2);
    expect(parseResult).to.have.keys(['*', 'screaming frog seo spider', 'sitemaps']);
    expect(parseResult['*'].allow).to.have.lengthOf(0);
    expect(parseResult['*'].disallow).to.have.lengthOf(16);
    expect(parseResult['screaming frog seo spider'].allow).to.have.lengthOf(0);
    expect(parseResult['screaming frog seo spider'].disallow).to.have.lengthOf(1);
    expect(parseResult.sitemaps).to.have.lengthOf(0);
  });
});
