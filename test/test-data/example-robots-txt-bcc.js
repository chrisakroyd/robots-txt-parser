module.exports = `
User-agent: *
Disallow: /*?fh_location*
Disallow: /search?*
Disallow: /*?price*
Disallow: /*?aspxerrorpath*
Disallow: /*?product*
Disallow: /*?tt*
Disallow: /*?category*
Disallow: /*?CID*
Disallow: /*?nietgevonden*
Disallow: /*?viewmode*
Disallow: /*?cIdee*
Disallow: /*?orderId*
Disallow: /*?token*
Disallow: /klantenservice?searchQuery=*
Disallow: /productdetail*
Disallow: /artikel=*

#Blog
User-agent: *
Disallow: /blog/wp-admin/
Disallow: /blog/tag/
Disallow: /page/
Disallow: /blog/ultimate_slider*

#Sitemap
User-Agent: *
Sitemap: https://www.bcc.nl/sitemap.xml
Sitemap: https://www.bcc.nl/cms-sitemap.xml
Sitemap: https://www.bcc.nl/video-sitemap.xml
Sitemap: https://www.bcc.nl/blog/sitemap.xml
Sitemap: https://www.bcc.nl/brands-sitemap.xml
Sitemap: https://www.bcc.nl/products-sitemap.xml
`;
