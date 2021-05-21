module.exports = {
  sitemaps:
  ['http://www.bbc.co.uk/news_sitemap.xml', 'http://www.bbc.co.uk/video_sitemap.xml',
    'http://www.bbc.co.uk/sitemap.xml', 'http://www.bbc.co.uk/mobile_sitemap.xml', 'http://www.bbc.co.uk/test.xml'],
  longbot: {
    allow: [{ specificity: 7, path: /^\/cheese$/ }, { specificity: 6, path: /^\/swiss$/ },
      { specificity: 12, path: /^\/swissywissy$/ }],
    disallow: [{ specificity: 6, path: /^\/swissy$/ }],
    crawlDelay: 3,
  },
  morebot: {
    allow: [{ specificity: 5, path: /^\/test$/ }, { specificity: 8, path: /^\/special$/ }],
    disallow: [{ specificity: 7, path: /^\/search$/ }, { specificity: 5, path: /^\/news$/ }],
    crawlDelay: 89,
  },
  '*':
  {
    allow: [{ specificity: 5, path: /^\/news$/ }, { specificity: 10, path: /^\/Testytest$/ },
      { specificity: 16, path: /^\/Test\/small-test$/ }],
    disallow: [{ specificity: 1, path: /^\/$/ }, { specificity: 5, path: /^\/spec$/ }],
    crawlDelay: 64,
  },
};
