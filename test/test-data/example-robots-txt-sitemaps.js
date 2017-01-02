module.exports = `
User-agent: Googlebot
Disallow: /iplayer/episode/*?from=r*
Disallow: /iplayer/cy/episode/*?from=r*
Disallow: /iplayer/gd/episode/*?from=r*
Sitemap: http://www.bbc.co.uk/news_sitemap.xml
Sitemap: http://www.bbc.co.uk/video_sitemap.xml
Sitemap: http://www.bbc.co.uk/sitemap.xml

User-agent: Googlebot-Mobile
Sitemap: http://www.bbc.co.uk/mobile_sitemap.xml
Disallow: /_programmes
Disallow: /606/
Disallow: /aboutthebbc/insidethebbc/search
Disallow: /academy/chinese-trad/search

User-agent: *
Sitemap: http://www.bbc.co.uk/sitemap.xml
Disallow: /_programmes
Disallow: /606/
Disallow: /aboutthebbc/insidethebbc/search
Disallow: /academy/chinese-trad/search
Disallow: /afrique/search
`;
