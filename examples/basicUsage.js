const robotsParser = require('../dist/index.js');

const robots = robotsParser({
  userAgent: 'Googlebot', // The default user agent to use when looking for allow/disallow rules, if this agent isn't listed in the active robots.txt, we use *.
  allowOnNeutral: false, // The value to use when the robots.txt rule's for allow and disallow are balanced on whether a link can be crawled.
});

console.log(robots);

robots.useRobotsFor('http://bbc.com').then(() => {
  robots.canCrawlSync('http://example.com/news'); // Returns true if the link can be crawled, false if not.
  robots.canCrawl('http://example.com/news', (value) => {
    console.log('Crawlable: ', value);
  }); // Calls the callback with true if the link is crawlable, false if not.
  robots
    .canCrawl('http://example.com/news') // If no callback is provided, returns a promise which resolves with true if the link is crawlable, false if not.
    .then((value) => {
      console.log('Crawlable: ', value);
      console.log(robots);
    });
});
