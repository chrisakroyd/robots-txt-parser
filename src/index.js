const get = require('./get.js');
const parser = require('./parser.js');
const util = require('./util/util.js');

const DFLT_OPTS = {
  userAgent: '*',
  allowOnNeutral: true,
};


function Robots(opts) {
  this.robotsCache = {};
  this.opts = Object.assign(DFLT_OPTS, opts);

  this.getRecordsForAgent = () => {
    const key = this.active;
    const domainBots = this.robotsCache[key] || {};
    const ourBotInBots = this.opts.userAgent in domainBots;
    const otherBots = '*' in domainBots;
    if (ourBotInBots) {
      return domainBots[this.opts.userAgent];
    } else if (otherBots) {
      return domainBots['*'];
    }
    return false;
  };

  this.allowed = (url) => {
    // Get the parsed robotsCache.txt for this domain.
    const botGroup = this.getRecordsForAgent();
    // Conditional allow, our bot or the * user agent is in the robotsCache.txt
    if (botGroup) {
      return this.canVisit(url, botGroup);
    }
    // Robots txt exists doesn't have any rules for our bot or *, therefore full allow.
    return true;
  };

  this.canVisit = (url, botGroup) => {
    const allow = util.applyRecords(url, botGroup.allow);
    const disallow = util.applyRecords(url, botGroup.disallow);
    const maxSpecificityAllow = util.maxSpecificity(allow);
    const maxSpecificityDisallow = util.maxSpecificity(disallow);
    const noAllows = allow.length === 0 && disallow.length > 0;
    const noDisallows = allow.length > 0 && disallow.length === 0;

    if (noAllows || (maxSpecificityAllow < maxSpecificityDisallow)) {
      return false;
    } else if (noDisallows || (maxSpecificityAllow > maxSpecificityDisallow)) {
      return true;
    }
    return this.opts.allowOnNeutral;
  };
}

Robots.prototype.isCached = function robotsExist(domain) {
  return util.formatLink(domain) in this.robotsCache;
};

Robots.prototype.fetch = function addRobots(link) {
  const formattedLink = util.formatLink(link);
  const robotsLink = `${formattedLink}/robots.txt`;
  return get(robotsLink)
    .then((data) => {
      this.robotsCache[formattedLink] = parser(data);
      this.active = link;
    });
};

// @TODO rework to be cleaner
Robots.prototype.canCrawl = function allowed(url) {
  if (!this.isCached(url)) {
    return this.fetch(url)
          .then(() => this.allowed(url));
  }
  return Promise.resolve(this.allowed(url));
};

Robots.prototype.useRobotsFor = function useRobots(url) {
  const link = util.formatLink(url);
  if (link in this.robotsCache) {
    this.active = link;
    return Promise.resolve();
  }
  return this.fetch(url);
};

Robots.prototype.getSitemaps = function getSitemaps() {
  return Promise.resolve(this.getSitemapsSync());
};


Robots.prototype.getCrawlDelay = function getCrawlDelay() {
  return Promise.resolve(this.getCrawlDelaySync());
};

Robots.prototype.canCrawlSync = function canFetch(url) {
  return this.allowed(url);
};

Robots.prototype.getSitemapsSync = function getSitemaps() {
  const botRecords = this.robotsCache[this.active];
  return botRecords ? botRecords.sitemaps : [];
};

Robots.prototype.getCrawlDelaySync = function getCrawlDelay() {
  const botRecords = this.robotsCache[this.active];
  return botRecords ? botRecords.crawlDelay : 0;
};


const robots = new Robots();

robots.fetch('http://bbc.co.uk').then(() => {
  console.log(robots.canCrawlSync('/apps/t'));
}).catch((err) => { console.log(err); });

module.exports = robots;
