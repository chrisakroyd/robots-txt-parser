module.exports = `
# version: d167f71fcf4277403ce3b7118a1fad5d25a41310

# HTTPS www.bbc.co.uk

User-agent: *
Sitemap: https://www.bbc.co.uk/sitemap.xml
Sitemap: https://www.bbc.co.uk/sitemaps/https-index-uk-archive.xml
Sitemap: https://www.bbc.co.uk/sitemaps/https-index-uk-news.xml
Sitemap: https://www.bbc.co.uk/food/sitemap.xml
Sitemap: https://www.bbc.co.uk/bitesize/sitemap/sitemapindex.xml
Sitemap: https://www.bbc.co.uk/teach/sitemap/sitemapindex.xml
Sitemap: https://www.bbc.co.uk/sitemaps/https-index-uk-archive_video.xml
Sitemap: https://www.bbc.co.uk/sitemaps/https-index-uk-video.xml
Sitemap: https://www.bbc.co.uk/sitemaps/sitemap-uk-ws-topics.xml
Sitemap: https://www.bbc.co.uk/sport/sitemap.xml

Disallow: /cbbc/search$
Disallow: /cbbc/search/
Disallow: /cbbc/search?
Disallow: /cbeebies/search$
Disallow: /cbeebies/search/
Disallow: /cbeebies/search?
Disallow: /chwilio/
Disallow: /chwilio$
Disallow: /chwilio?
Disallow: /iplayer/bigscreen/
Disallow: /iplayer/cbbc/episodes/
Disallow: /iplayer/cbbc/search
Disallow: /iplayer/cbeebies/episodes/
Disallow: /iplayer/cbeebies/search
Disallow: /iplayer/search
Disallow: /indepthtoolkit/smallprox$
Disallow: /indepthtoolkit/smallprox/
Disallow: /modules/musicnav/language/
Disallow: /news/0
Disallow: /radio/aod/
Disallow: /radio/aod$
Disallow: /radio/imda
Disallow: /radio/player/
Disallow: /radio/player$
Disallow: /search/
Disallow: /search$
Disallow: /search?
Disallow: /sport/videos/*
Disallow: /sounds/player/
Disallow: /sounds/player$
Disallow: /ugc$
Disallow: /ugc/
Disallow: /ugcsupport$
Disallow: /ugcsupport/
Disallow: /userinfo/
Disallow: /userinfo
Disallow: /food/favourites
Disallow: /food/menus/*/shopping-list
Disallow: /food/recipes/*/shopping-list
Disallow: /food/search*?*
Disallow: /sounds/search$
Disallow: /sounds/search/
Disallow: /sounds/search?
Disallow: /ws/includes

User-agent: magpie-crawler
Disallow: /
`;
