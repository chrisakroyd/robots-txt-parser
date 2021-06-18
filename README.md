# robots-txt-parser

[![Coverage Status](https://coveralls.io/repos/github/chrisakroyd/robots-txt-parser/badge.svg?branch=master)](https://coveralls.io/github/chrisakroyd/robots-txt-parser?branch=master)
[![npm version](https://badge.fury.io/js/robots-txt-parser.svg)](https://badge.fury.io/js/robots-txt-parser)
![npm](https://img.shields.io/npm/dm/robots-txt-parser)

A lightweight robots.txt parser for Node.js with support for wildcards, caching and promises.

## Installing
Via NPM: `npm install robots-txt-parser --save`.

## Getting Started

After installing robots-txt-parser it needs to be required and initialised:
```js
const robotsParser = require('robots-txt-parser');
const robots = robotsParser(
  {
    userAgent: 'Googlebot', // The default user agent to use when looking for allow/disallow rules, if this agent isn't listed in the active robots.txt, we use *.
    allowOnNeutral: false // The value to use when the robots.txt rule's for allow and disallow are balanced on whether a link can be crawled.
  });
```

Example Usage:


```js
const robotsParser = require('robots-txt-parser');

const robots = robotsParser(
  {
    userAgent: 'Googlebot', // The default user agent to use when looking for allow/disallow rules, if this agent isn't listed in the active robots.txt, we use *.
    allowOnNeutral: false, // The value to use when the robots.txt rule's for allow and disallow are balanced on whether a link can be crawled.
  },
);

robots.useRobotsFor('http://example.com')
  .then(() => {
    robots.canCrawlSync('http://example.com/news'); // Returns true if the link can be crawled, false if not.
    robots.canCrawl('http://example.com/news', (value) => {
      console.log('Crawlable: ', value);
    }); // Calls the callback with true if the link is crawlable, false if not.
    robots.canCrawl('http://example.com/news') // If no callback is provided, returns a promise which resolves with true if the link is crawlable, false if not.
      .then((value) => {
        console.log('Crawlable: ', value);
      });
  });
```

## Condensed Documentation

Below is a condensed form of the documentation, each is a function that can be found on the robotsParser object.

| Method | Parameters | Return |
| ----------- | -------- | ------ |
| [parseRobots(key, string)](#parserobots) | `key:String, string:String` | None |
| [isCached(domain)](#iscached) | `domain:String` | Boolean for whether robots.txt for url is cached. |
| [fetch(url)](#fetch) | `url:String` | Promise, resolved when robots.txt retrieved. |
| [useRobotsFor(url)](#userobotsfor) | `url:String` | Promise, resolved when robots.txt is fetched. |
| [canCrawl(url)](#cancrawl)| `url:String, callback:Func (Opt)` | Promise, resolves with Boolean. |
| [getSitemaps()](#getsitemaps)| `callback:Func (Opt)` | Promise if no callback provided, resolves with [String]. |
| [getCrawlDelay()](#getcrawldelay) | `callback:Func (Opt)` | Promise if no callback provided, resolves with Number. |
| [getCrawlableLinks(links)](#getcrawlablelinks) | `links:[String], callback:Func (Opt)` | Promise if no callback provided, resolves with [String]. |
| [getPreferredHost()](#getpreferredhost) | `callback:Func (Opt)` | Promise if no callback provided, resolves with String. |
| [setUserAgent(userAgent)](#setuseragent) | `userAgent:String` | None. |
| [setAllowOnNeutral(allow)](#setallowonneutral)  | `allow:Boolean` | None. |
| [clearCache()](#clearcache) | `None` | None. |

## Full Documentation

---

### parseRobots
`robots.parseRobots(key, string)`
Parses a string representation of a robots.txt file and cache's it with the given key.

##### Parameters
* key -> Can be any URL.
* string -> String representation of a robots.txt file.

##### Returns
None.

##### Example

```js
robots.parseRobots('https://example.com',
  `
   User-agent: *
   Allow: /*.php$
   Disallow: /
  `);
```

---

### isCached
`robots.isCached(domain)`
A method used to check if a robots.txt has already been fetched and parsed.

##### Parameters
* domain -> Can be any URL.

##### Returns
Returns true if a robots.txt has already been fetched and cached by the robots-txt-parser.

##### Example

```js
robots.isCached('https://example.com'); // true or false
robots.isCached('example.com'); // Attempts to check the cache for only http:// and returns true or false.
```

---

### fetch
`robots.fetch(url)`
Attempts to fetch and parse a robots.txt file located at the url, this method avoids checking the built-in cache and will always attempt to retrieve a fresh copy of the robots.txt.

##### Parameters
* url -> Any URL.

##### Returns
Returns a Promise which will resolve once the robots.txt has been fetched with the parsed robots.txt.

##### Example

```js
robots.fetch('https://example.com/robots.txt')
    .then((tree) => {
        console.log(Object.keys(tree)); // Will log sitemap and any user agents.
    });
```

---

### useRobotsFor
`robots.useRobotsFor(url)`
Attempts to download and use the robots.txt at the given url, if the robots.txt has already been downloaded, reads from the cached copy instead.

##### Parameters
* url -> Any URL.

##### Returns
Returns a promsise that resolves once the URL is fetched and parsed.

##### Example

```js
robots.useRobotsFor('https://example.com/news')
    .then(() => {
        // Logic to check if links are crawlable.
    });
```

---

### canCrawl
`robots.canCrawl(url, callback)`
Tests whether a url can be crawled for the current active robots.txt and user agent. If a robots.txt isn't cached for the domain of the url, it is fetched and parsed before returning a boolean value.
##### Parameters
* url -> Any URL.
* callback -> An optional callback, if undefined returns a promise.

##### Returns
Returns a Promise which will resolve with a boolean value.

##### Example

```js
robots.canCrawl('https://example.com/news')
    .then((crawlable) => {
        console.log(crawlable); // Will log a boolean value.
    });
```

---

### getSitemaps
`robots.getSitemaps(callback)`
Returns a list of sitemaps present on the active robots.txt.

##### Parameters
* callback -> An optional callback, if undefined returns a promise.

##### Returns
Returns a Promise which will resolve with an array of strings.

##### Example

```js
robots.getSitemaps()
    .then((sitemaps) => {
        console.log(sitemaps); // Will log an list of strings.
    });
```

---

### getCrawlDelay
`robots.getCrawlDelay(callback)`
Returns the crawl delay on requests to the current active robots.txt.

##### Parameters
* callback -> An optional callback, if undefined returns a promise.

##### Returns
Returns a Promise which will resolve with an Integer.

##### Example

```js
robots.getCrawlDelay()
    .then((crawlDelay) => {
        console.log(crawlDelay); // Will be an Integer greater than or equal to 0.
    });
```

---

### getCrawlableLinks
`robots.getCrawlableLinks(links, callback)`
Takes an array of links and returns an array of links which are crawlable
for the current active robots.txt.

##### Parameters
* links -> An array of links to check for crawlability.
* callback -> An optional callback, if undefined returns a promise.

##### Returns
A Promise that will resolve to contain an Array of all the crawlable links.

##### Example

```js
robots.getCrawlableLinks([])
    .then((links) => {
        console.log(links);
    });
```

---

### getPreferredHost
`robots.getPreferredHost(callback)`
Returns the preferred host name specified in the active robots.txt's host: directive or null if there isn't one.

##### Parameters
* callback -> An optional callback, if undefined returns a promise.

##### Returns
An String if the host is defined, undefined otherwise.

##### Example

```js
robots.getPreferredHost()
    .then((host) => {
        console.log(host);
    });
```

---

### setUserAgent
`robots.setUserAgent(userAgent)`
Sets the current user agent to use when checking if a link can be crawled.

##### Parameters
* userAgent -> A string.

##### Returns
undefined

##### Example

```js
robots.setUserAgent('exampleBot'); // When interacting with the robots.txt we now look for records for 'exampleBot'.
robots.setUserAgent('testBot'); // When interacting with the robots.txt we now look for records for 'testBot'.
```

---

### setAllowOnNeutral
`robots.setAllowOnNeutral(allow)`
Sets the canCrawl behaviour to return true or false when the robots.txt rules are balanced on whether a link should be crawled or not.

##### Parameters
* allow -> A boolean value.

##### Returns
undefined

##### Example

```js
robots.setAllowOnNeutral(true); // If the allow/disallow rules are balanced, canCrawl returns true.
robots.setAllowOnNeutral(false); // If the allow/disallow rules are balanced, canCrawl returns false.
```

---

### clearCache
`robots.clearCache()`
The cache can get extremely long over extended crawling, this simple method resets the cache.

##### Parameters
None

##### Returns
None

##### Example

```js
robots.clearCache();
```

---

## Synchronous API
Synchronous variants of the API, will be deprecated in a future version.
### canCrawlSync
`robots.canCrawlSync(url)`
Tests whether a url can be crawled for the current active robots.txt and user agent. This won't attempt to fetch the robots.txt if it is not cached.

##### Parameters
* url -> Any url.

##### Returns
Returns a boolean value depending on whether the url is crawlable. If there is no cached robots.txt for this url, it will always return true.

##### Example

```js
robots.canCrawlSync('https://example.com/news') // true or false.
```

---

### getSitemapsSync()
`robots.getSitemapsSync()`
Returns a list of sitemaps present on the active robots.txt.

##### Parameters
None
##### Returns
An Array of Strings.
##### Example

```js
robots.getSitemapsSync(); // Will be an array e.g. ['http://example.com/sitemap1.xml', 'http://example.com/sitemap2.xml'].
```

---

### getCrawlDelaySync()
`robots.getCrawlDelaySync()`
Returns the crawl delay on specified in the active robots.txt's for the active user agent

##### Parameters
None
##### Returns
An Integer greater than or equal to 0.
##### Example

```js
robots.getCrawlDelaySync(); // Will be an Integer.
```

---

### getCrawlableLinksSync
`robots.getCrawlableLinksSync(links)`
Takes an array of links and returns an array of links which are crawlable
for the current active robots.txt.
##### Parameters
* links -> An array of links to check for crawlability.

##### Returns
An Array of all the links are crawlable.

##### Example

```js
robots.getCrawlableLinks(['example.com/test/news', 'example.com/test/news/article']);  // Will return an array of the links that can be crawled.
```

---

### getPreferredHostSync
`robots.getPreferredHostSync()`
Returns the preferred host name specified in the active robots.txt's host: directive or undefined if there isn't one.

##### Parameters
None
##### Returns
An String if the host is defined, undefined otherwise.
##### Example

```js
robots.getPreferredHostSync(); // Will be a string if the host directive is defined .
```

# License
See [LICENSE](https://github.com/ChristopherAkroyd/robots-txt-parser/blob/master/LICENSE) file.

# Resources

  * [Robots.txt Specifications by Google](http://code.google.com/web/controlcrawlindex/docs/robots_txt.html)
  * [A Standard for Robot Exclusion](http://www.robotstxt.org/orig.html)
  * [Robots.txt Specifications by Yandex](https://yandex.com/support/webmaster/controlling-robot/robots-txt.xml)
