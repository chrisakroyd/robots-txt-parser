# robots-txt-parser
## Installation
Via NPM: Coming Soon.

Via Yarn: Coming Soon.

## Usage


```js
var robotsParser = require('robots-txt-parser');

var robots = robotsParser(
  {
    userAgent: 'Googlebot',
    allowOnNeutral: false,
  });
  
robots.useRobotsFor('http://Example.com')
  .then(() => {
    robots.canCrawl('http://example.com/news'); // Returns true if the link can be crawled by the specified user agent.
    robots.getCrawlableLinks(['http://example.com/news', 'http://example.com/news/test']); // Returns a list of all links that can be crawled out of the given list.
    robots.getCrawlDelay(); // Returns crawl delay specified in the robots.txt file for that domain
    robots.getSitemaps(); // Returns a list of all sitemaps listed in the robots.txt.
    robots.setUserAgent('*'); // Sets the user agent used to test whether a link can be crawled to be *.
  });

```

### parseRobots(key, string)

Parses a string representation of a robots.txt file and cache's it with the given key.

### isCached(domain)

Returns true if a robots.txt has already been fetched and cached by the robots-txt-parser.

### fetch(url) 

Attempts to fetch and parse a robots.txt file located at the url.

### canCrawl(url)

Tests whether a url can be crawled for the current active robots.txt and user agent.


### useRobotsFor(url)

Attempts to download and use the robots.txt at the given url, if the robots.txt has already been downloaded, reads from the cached copy instead.

### getSitemaps()

Returns a list of sitemaps present on the active robots.txt.

### getCrawlDelay()

Returns the crawl delay on requests to the current active robots.txt

### canCrawlSync()

Tests whether a url can be crawled for the current active robots.txt and user agent.

### getCrawlableLinks(links)
Takes an array of links and returns an array of links which are crawlable
for the current active robots.txt.
 
### getCrawlableLinksP(links)
Same as above except returns a promise.

### getSitemapsSync()

Returns a list of sitemaps present on the active robots.txt.


### getCrawlDelaySync()

Returns the crawl delay on requests to the current active robots.txt

### setUserAgent(userAgent)

Sets the current user agent to use when checking if a link can be crawled.

### setAllowOnNeutral(allow)

Sets the canCrawl behaviour to return true or false when the robots.txt rules are balanced on whether a link should be crawled or not.

## TODOs

Documentation.
Additional tests.
Npm page.
Stabilise API.

# License 
