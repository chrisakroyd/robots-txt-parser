const get = require('./get.js');
const parser = require('./parser.js');
const util = require('./util/util.js');

const DFLT_OPTS = {
  userAgent: '*',
  allowOnNeutral: true,
};

function Robots(opts = {}) {
  this.robotsCache = {};
  this.opts = {
    userAgent: opts.userAgent ? opts.userAgent.toLowerCase() : DFLT_OPTS.userAgent,
    allowOnNeutral: opts.allowOnNeutral ? opts.allowOnNeutral : DFLT_OPTS.allowOnNeutral,
  };

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

  this.canVisit = (url, botGroup) => {
    const allow = util.applyRecords(url, botGroup.allow);
    const disallow = util.applyRecords(url, botGroup.disallow);
    const maxSpecificityAllow = util.maxSpecificity(allow);
    const maxSpecificityDisallow = util.maxSpecificity(disallow);
    const noAllows = allow.length === 0 && disallow.length > 0;
    const noDisallows = allow.length > 0 && disallow.length === 0;

    // No rules for allow or disallow apply, therefore full allow.
    if (noAllows && noDisallows) {
      return true;
    }

    if (noDisallows || (maxSpecificityAllow > maxSpecificityDisallow)) {
      return true;
    } else if (noAllows || (maxSpecificityAllow < maxSpecificityDisallow)) {
      return false;
    }
    return this.opts.allowOnNeutral;
  };
}

Robots.prototype.parseRobots = function parseRobots(url, string) {
  const formattedLink = util.formatLink(url);
  this.robotsCache[formattedLink] = parser(string);
  this.active = formattedLink;
};

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
  if (this.isCached(url)) {
    return Promise.resolve(this.canCrawlSync(url));
  }
  return this.fetch(url).then(() => this.canCrawlSync(url));
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
  // Get the parsed robotsCache.txt for this domain.
  const botGroup = this.getRecordsForAgent();
  // Conditional allow, our bot or the * user agent is in the robotsCache.txt
  if (botGroup) {
    return this.canVisit(url, botGroup);
  }
  // Robots txt exists doesn't have any rules for our bot or *, therefore full allow.
  return true;
};


/*
 * Takes an array of links and returns an array of links which are crawlable
 * for the given domain.
 */
Robots.prototype.getCrawlableLinks = function getCrawlableLinks(linkArray) {
  const links = linkArray instanceof Array ? linkArray : [linkArray];
  const crawlableLinks = [];
  const botGroup = this.getRecordsForAgent();
  if (botGroup) {
    for(let i = 0; i < links.length; i +=1) {
      const link = links[i];
      if(this.canVisit(link, botGroup)) {
        crawlableLinks.push(link);
      }
    }
  }
  return crawlableLinks;
};

Robots.prototype.getCrawlableLinksP = function getCrawlableLinksP(linkArray) {
  return Promise.resolve(this.getCrawlableLinks(linkArray));
};

Robots.prototype.getSitemapsSync = function getSitemaps() {
  const botRecords = this.robotsCache[this.active];
  return botRecords ? botRecords.sitemaps : [];
};

Robots.prototype.getCrawlDelaySync = function getCrawlDelay() {
  const botRecords = this.getRecordsForAgent();
  return botRecords ? botRecords.crawlDelay : 0;
};

Robots.prototype.setUserAgent = function setUserAgent(agent) {
  this.opts.userAgent = agent.toLowerCase();
};

Robots.prototype.setAllowOnNeutral = function setAllowOnNeutral(allow) {
  this.opts.allowOnNeutral = allow;
};

module.exports = Robots;
