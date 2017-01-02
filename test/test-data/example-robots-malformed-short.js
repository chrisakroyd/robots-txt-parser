module.exports = `
Comments should be ignored.
Short bot test part 1.

User-agent: 
Allow: /cheese
Disallow: /swiss
Crawl-delay: 3
Sitemap: http://www.bbc.co.uk/news_sitemap.xml
Sitemap: 
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: MoreBot
Allow: /test
Allow:
Disallow: 
Disallow: /news
Crawl-delay: 89
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: 
Allow: /news
Allow: 
Disallow: 
Crawl-delay: 
Sitemap: http://www.bbc.co.uk/mobile_sitemap.xml
`;
