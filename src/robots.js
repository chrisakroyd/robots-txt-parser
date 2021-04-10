const get = require('./get.js');
const isFunction = require('lodash.isfunction');
const parser = require('./parser.js');
const util = require('./util.js');

const DFLT_OPTS = {
  userAgent: '*',
  allowOnNeutral: true,
};

function Robots(opts = {}) {
  this.robotsCache = {};
  this.opts = {
    userAgent: opts.userAgent ? opts.userAgent.toLowerCase() : DFLT_OPTS.userAgent.toLowerCase(),
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
    const noAllows = allow.numApply === 0 && disallow.numApply > 0;
    const noDisallows = allow.numApply > 0 && disallow.numApply === 0;

    // No rules for allow or disallow apply, therefore full allow.
    if (noAllows && noDisallows) {
      return true;
    }

    if (noDisallows || (allow.maxSpecificity > disallow.maxSpecificity)) {
      return true;
    } else if (noAllows || (allow.maxSpecificity < disallow.maxSpecificity)) {
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

Robots.prototype.fetch = function addRobots(link) {
  const formattedLink = util.formatLink(link);
  const robotsLink = `${formattedLink}/robots.txt`;
  return get(robotsLink)
    .then((data) => {
      this.robotsCache[formattedLink] = parser(data);
      this.active = link;
      return this.robotsCache[formattedLink];
    });
};

Robots.prototype.isCached = function robotsExist(domain) {
  return util.formatLink(domain) in this.robotsCache;
};

Robots.prototype.useRobotsFor = function useRobots(url, callback) {
  const link = util.formatLink(url);
  const isCached = this.isCached(link);
  if (isCached) {
    this.active = link;
    if (isFunction(callback)) {
      callback();
    } else {
      return Promise.resolve();
    }
  }

  return this.fetch(url);
};

// @TODO rework to be cleaner
Robots.prototype.canCrawl = function canCrawl(url, callback) {
  const isCached = this.isCached(url);
  if (isCached) {
    const crawlable = this.canCrawlSync(url);
    if (isFunction(callback)) {
      callback(crawlable);
    } else {
      return Promise.resolve(crawlable);
    }
  }
  return this.fetch(url).then(() => this.canCrawlSync(url));
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

Robots.prototype.getSitemaps = function getSitemaps(callback) {
  const sitemaps = this.getSitemapsSync();
  if (isFunction(callback)) {
    callback(sitemaps)
  } else {
    return Promise.resolve(sitemaps);
  }
};

Robots.prototype.getSitemapsSync = function getSitemaps() {
  const botRecords = this.robotsCache[this.active];
  return botRecords ? botRecords.sitemaps : [];
};

Robots.prototype.getCrawlDelay = function getCrawlDelay(callback) {
  const crawlDelay = this.getCrawlDelaySync();
  if (isFunction(callback)) {
    callback(crawlDelay)
  } else {
    return Promise.resolve(crawlDelay);
  }
};

Robots.prototype.getCrawlDelaySync = function getCrawlDelay() {
  const botRecords = this.getRecordsForAgent();
  return botRecords ? botRecords.crawlDelay : 0;
};

Robots.prototype.getCrawlableLinks = function getCrawlableLinks(linkArray, callback) {
  const crawlableLinks = this.getCrawlableLinksSync(linkArray);
  if (isFunction(callback)) {
    callback(crawlableLinks);
  } else {
    return Promise.resolve(crawlableLinks);
  }
};

/*
 * Takes an array of links and returns an array of links which are crawlable
 * for the given domain.
 */
Robots.prototype.getCrawlableLinksSync = function getCrawlableLinksSync(linkArray) {
  const links = linkArray instanceof Array ? linkArray : [linkArray];
  const crawlableLinks = [];
  const botGroup = this.getRecordsForAgent();
  if (botGroup) {
    for(let i = 0; i < links.length; i +=1) {
      if(this.canVisit(links[i], botGroup)) {
        crawlableLinks.push(links[i]);
      }
    }
  }
  return crawlableLinks;
};

Robots.prototype.getPreferredHost = function getPreferredHost(callback) {
  const host = this.getPreferredHostSync();
  if (isFunction(callback)) {
    callback(host);
  } else {
    return Promise.resolve(host);
  }
};

Robots.prototype.getPreferredHostSync = function getPreferredHostSync() {
  const botRecords = this.robotsCache[this.active] || {};
  return botRecords.host
};

Robots.prototype.setUserAgent = function setUserAgent(agent) {
  this.opts.userAgent = agent.toLowerCase();
};

Robots.prototype.setAllowOnNeutral = function setAllowOnNeutral(allow) {
  this.opts.allowOnNeutral = allow;
};

Robots.prototype.clearCache = function clearCache() {
  this.robotsCache = {};
};

module.exports = Robots;
