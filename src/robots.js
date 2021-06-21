const get = require('./get.js');
const parser = require('./parser.js');
const util = require('./util.js');

const DFLT_OPTS = {
  userAgent: '*',
  allowOnNeutral: true,
  timeout: 10000,
};

class Robots {
  constructor(opts = {}) {
    this.robotsCache = {};
    this.opts = {
      userAgent: opts.userAgent ? opts.userAgent.toLowerCase() : DFLT_OPTS.userAgent.toLowerCase(),
      allowOnNeutral: opts.allowOnNeutral ? opts.allowOnNeutral : DFLT_OPTS.allowOnNeutral,
      timeout: opts.timeout ? opts.timeout : DFLT_OPTS.timeout,
    };
  }

  getRecordsForAgent() {
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
  }

  canVisit(url, botGroup) {
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
  }

  parseRobots(url, string) {
    const formattedLink = util.formatLink(url);
    this.robotsCache[formattedLink] = parser(string);
    this.active = formattedLink;
  }

  fetch(link) {
    const formattedLink = util.formatLink(link);
    const robotsLink = `${formattedLink}/robots.txt`;
    return get(robotsLink, this.opts.timeout)
      .then((data) => {
        this.robotsCache[formattedLink] = parser(data);
        this.active = link;
        return this.robotsCache[formattedLink];
      });
  }

  isCached(domain) {
    return util.formatLink(domain) in this.robotsCache;
  }

  useRobotsFor(url, callback) {
    const link = util.formatLink(url);

    if (this.isCached(link)) {
      this.active = link;
      if (util.isFunction(callback)) {
        return callback();
      }
      return Promise.resolve();
    }

    const fetch = this.fetch(url);

    if (util.isFunction(callback)) {
      return fetch.then(callback);
    }

    return fetch;
  }

  canCrawl(url, callback) {
    if (this.isCached(url)) {
      const crawlable = this.canCrawlSync(url);
      if (util.isFunction(callback)) {
        return callback(crawlable);
      }
      return Promise.resolve(crawlable);
    }

    return this.fetch(url).then(() => {
      const crawlable = this.canCrawlSync(url);
      if (util.isFunction(callback)) {
        return callback(crawlable);
      }
      return crawlable;
    });
  }

  canCrawlSync(url) {
    // Get the parsed robotsCache.txt for this domain.
    const botGroup = this.getRecordsForAgent();
    // Conditional allow, our bot or the * user agent is in the robotsCache.txt
    if (botGroup) {
      return this.canVisit(url, botGroup);
    }
    // Robots txt exists doesn't have any rules for our bot or *, therefore full allow.
    return true;
  }

  getSitemaps(callback) {
    const sitemaps = this.getSitemapsSync();
    if (util.isFunction(callback)) {
      return callback(sitemaps);
    }
    return Promise.resolve(sitemaps);
  }

  getSitemapsSync() {
    const botRecords = this.robotsCache[this.active];
    return botRecords ? botRecords.sitemaps : [];
  }

  getCrawlDelay(callback) {
    const crawlDelay = this.getCrawlDelaySync();
    if (util.isFunction(callback)) {
      return callback(crawlDelay);
    }
    return Promise.resolve(crawlDelay);
  }

  getCrawlDelaySync() {
    const botRecords = this.getRecordsForAgent();
    return botRecords ? botRecords.crawlDelay : 0;
  }

  getCrawlableLinks(linkArray, callback) {
    const crawlableLinks = this.getCrawlableLinksSync(linkArray);
    if (util.isFunction(callback)) {
      return callback(crawlableLinks);
    }
    return Promise.resolve(crawlableLinks);
  }

  /*
   * Takes an array of links and returns an array of links which are crawlable
   * for the given domain.
   */
  getCrawlableLinksSync(linkArray) {
    const links = linkArray instanceof Array ? linkArray : [linkArray];
    const crawlableLinks = [];
    const botGroup = this.getRecordsForAgent();
    if (botGroup) {
      for (let i = 0; i < links.length; i += 1) {
        if (this.canVisit(links[i], botGroup)) {
          crawlableLinks.push(links[i]);
        }
      }
    }
    return crawlableLinks;
  }

  getPreferredHost(callback) {
    const host = this.getPreferredHostSync();
    if (util.isFunction(callback)) {
      callback(host);
    }
    return Promise.resolve(host);
  }

  getPreferredHostSync() {
    const botRecords = this.robotsCache[this.active] || {};
    return botRecords.host;
  }

  setUserAgent(agent) {
    this.opts.userAgent = agent.toLowerCase();
  }

  setAllowOnNeutral(allow) {
    this.opts.allowOnNeutral = allow;
  }

  clearCache() {
    this.robotsCache = {};
  }
}

module.exports = Robots;
