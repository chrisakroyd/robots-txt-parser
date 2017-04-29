module.exports = `
# Comments should be ignored.
# Short bot test part 1.
User-agent: Longbot
Allow: /cheese
Allow: /swiss
Allow: /swissywissy
Disallow: /swissy
Crawl-delay: 3
Sitemap: http://www.bbc.co.uk/news_sitemap.xml
Sitemap: http://www.bbc.co.uk/video_sitemap.xml
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: MoreBot
Allow: /test
Allow: /special
Disallow: /search
Disallow: /news
Crawl-delay: 89
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: *
Allow: /news
Allow: /Testytest
Allow: /Test/small-test
Disallow: /
Disallow: /spec
Crawl-delay: 64
Sitemap: http://www.bbc.co.uk/mobile_sitemap.xml

Sitemap: http://www.bbc.co.uk/test.xml
host: http://www.bbc.co.uk
`;
