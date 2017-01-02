module.exports = `
# Comments should be ignored.
# Short bot test part 1.
User-agent: Longbot
Allow: /cheese
Disallow: /swiss
Crawl-delay: 3
Sitemap: http://www.bbc.co.uk/news_sitemap.xml
Sitemap: http://www.bbc.co.uk/video_sitemap.xml
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: MoreBot
Allow: /test
Disallow: /search
Disallow: /news
Crawl-delay: 89
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: *
Allow: /news
Allow: /Test
Disallow: /
Crawl-delay: 64
Sitemap: http://www.bbc.co.uk/mobile_sitemap.xml

Sitemap: http://www.bbc.co.uk/test.xml
`;
