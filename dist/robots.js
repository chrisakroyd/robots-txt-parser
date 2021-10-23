"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var get_1 = __importDefault(require("./get"));
var parser_1 = __importDefault(require("./parser"));
var util = __importStar(require("./util"));
var DFLT_OPTS = {
    userAgent: '*',
    allowOnNeutral: true,
    timeout: 10000,
};
var Robots = /** @class */ (function () {
    function Robots(opts) {
        if (opts === void 0) { opts = {}; }
        this.robotsCache = {};
        this.active = '';
        this.opts = {
            userAgent: opts.userAgent
                ? opts.userAgent.toLowerCase()
                : DFLT_OPTS.userAgent.toLowerCase(),
            allowOnNeutral: opts.allowOnNeutral
                ? opts.allowOnNeutral
                : DFLT_OPTS.allowOnNeutral,
            timeout: opts.timeout ? opts.timeout : DFLT_OPTS.timeout,
        };
    }
    Robots.prototype.getRecordsForAgent = function () {
        var key = this.active;
        var domainBots = this.robotsCache[key] || {};
        var ourBotInBots = this.opts.userAgent in domainBots;
        var otherBots = '*' in domainBots;
        if (ourBotInBots) {
            return domainBots[this.opts.userAgent];
        }
        else if (otherBots) {
            return domainBots['*'];
        }
        return false;
    };
    Robots.prototype.canVisit = function (url, botGroup) {
        var allow = util.applyRecords(url, botGroup.allow);
        var disallow = util.applyRecords(url, botGroup.disallow);
        var noAllows = allow.numApply === 0 && disallow.numApply > 0;
        var noDisallows = allow.numApply > 0 && disallow.numApply === 0;
        // No rules for allow or disallow apply, therefore full allow.
        if (noAllows && noDisallows) {
            return true;
        }
        if (noDisallows || allow.maxSpecificity > disallow.maxSpecificity) {
            return true;
        }
        else if (noAllows || allow.maxSpecificity < disallow.maxSpecificity) {
            return false;
        }
        return this.opts.allowOnNeutral;
    };
    Robots.prototype.parseRobots = function (url, string) {
        var formattedLink = util.formatLink(url);
        this.robotsCache[formattedLink] = (0, parser_1.default)(string);
        this.active = formattedLink;
    };
    Robots.prototype.fetch = function (link) {
        var _this = this;
        var formattedLink = util.formatLink(link);
        var robotsLink = formattedLink + "/robots.txt";
        return (0, get_1.default)(robotsLink, this.opts.timeout).then(function (data) {
            _this.robotsCache[formattedLink] = (0, parser_1.default)(data);
            _this.active = link;
            return _this.robotsCache[formattedLink];
        });
    };
    Robots.prototype.isCached = function (domain) {
        return util.formatLink(domain) in this.robotsCache;
    };
    Robots.prototype.useRobotsFor = function (url, callback) {
        var link = util.formatLink(url);
        if (this.isCached(link)) {
            this.active = link;
            if (callback && util.isFunction(callback)) {
                return callback();
            }
            return Promise.resolve();
        }
        var fetch = this.fetch(url);
        if (util.isFunction(callback)) {
            return fetch.then(callback);
        }
        return fetch;
    };
    Robots.prototype.canCrawl = function (url, callback) {
        var _this = this;
        if (this.isCached(url)) {
            var crawlable = this.canCrawlSync(url);
            if (util.isFunction(callback) && callback) {
                return callback(crawlable);
            }
            return Promise.resolve(crawlable);
        }
        return this.fetch(url).then(function () {
            var crawlable = _this.canCrawlSync(url);
            if (util.isFunction(callback) && callback) {
                return callback(crawlable);
            }
            return crawlable;
        });
    };
    Robots.prototype.canCrawlSync = function (url) {
        // Get the parsed robotsCache.txt for this domain.
        var botGroup = this.getRecordsForAgent();
        // Conditional allow, our bot or the * user agent is in the robotsCache.txt
        if (botGroup) {
            return this.canVisit(url, botGroup);
        }
        // Robots txt exists doesn't have any rules for our bot or *, therefore full allow.
        return true;
    };
    Robots.prototype.getSitemaps = function (callback) {
        var sitemaps = this.getSitemapsSync();
        if (util.isFunction(callback) && callback) {
            return callback(sitemaps);
        }
        return Promise.resolve(sitemaps);
    };
    Robots.prototype.getSitemapsSync = function () {
        var botRecords = this.robotsCache[this.active];
        return botRecords ? botRecords.sitemaps : [];
    };
    Robots.prototype.getCrawlDelay = function (callback) {
        var crawlDelay = this.getCrawlDelaySync();
        if (util.isFunction(callback) && callback) {
            return callback(crawlDelay);
        }
        return Promise.resolve(crawlDelay);
    };
    Robots.prototype.getCrawlDelaySync = function () {
        var botRecords = this.getRecordsForAgent();
        return botRecords ? botRecords.crawlDelay : 0;
    };
    Robots.prototype.getCrawlableLinks = function (linkArray, callback) {
        var crawlableLinks = this.getCrawlableLinksSync(linkArray);
        if (util.isFunction(callback) && callback) {
            return callback(crawlableLinks);
        }
        return Promise.resolve(crawlableLinks);
    };
    /*
     * Takes an array of links and returns an array of links which are crawlable
     * for the given domain.
     */
    Robots.prototype.getCrawlableLinksSync = function (linkArray) {
        var links = linkArray instanceof Array ? linkArray : [linkArray];
        var crawlableLinks = [];
        var botGroup = this.getRecordsForAgent();
        if (botGroup) {
            for (var i = 0; i < links.length; i += 1) {
                if (this.canVisit(links[i], botGroup)) {
                    crawlableLinks.push(links[i]);
                }
            }
        }
        return crawlableLinks;
    };
    Robots.prototype.getPreferredHost = function (callback) {
        var host = this.getPreferredHostSync();
        if (util.isFunction(callback) && callback) {
            callback(host);
        }
        return Promise.resolve(host);
    };
    Robots.prototype.getPreferredHostSync = function () {
        var botRecords = this.robotsCache[this.active] || {};
        return botRecords.host;
    };
    Robots.prototype.setUserAgent = function (agent) {
        this.opts.userAgent = agent.toLowerCase();
    };
    Robots.prototype.setAllowOnNeutral = function (allow) {
        this.opts.allowOnNeutral = allow;
    };
    Robots.prototype.clearCache = function () {
        this.robotsCache = {};
    };
    return Robots;
}());
module.exports = Robots;
