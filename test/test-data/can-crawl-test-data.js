module.exports = [{
  robots: `
    User-agent: /
    Allow: /
    
    User-agent: /*
    Allow: /*
  `,
  testPath: '/, /*',
  matches: ['/fish', '/fish.html', '/fish/salmon.html', '/fishheads', '/fishheads/yummy.html', '/fish.php?id=anything',
    '/fish/', '/fish/?id=anything', '/fish/salmon.htm'],
  nonMatch: [],
}, {
  robots: `
   User-agent: /fish
   Allow: /fish
   Disallow: /
   
   User-agent: /fish*
   Allow: /fish*
   Disallow: /
  `,
  testPath: '/fish, /fish*',
  matches: ['/fish', '/fish.html', '/fish/salmon.html', '/fishheads', '/fishheads/yummy.html', '/fish.php?id=anything'],
  nonMatch: ['/Fish.asp', '/catfish', '/?id=fish'],
}, {
  robots: `
   User-agent: /fish/
   Allow: /fish/
   Disallow: /
  `,
  testPath: '/fish/',
  matches: ['/fish/', '/fish/?id=anything', '/fish/salmon.htm'],
  nonMatch: ['/fish', '/fish.html', '/Fish/Salmon.asp'],
}, {
  robots: `
   User-agent: /*.php
   Allow: /*.php
   Disallow: /
  `,
  testPath: '/*.php',
  matches: ['/filename.php', '/folder/filename.php', '/folder/filename.php?parameters', '/folder/any.php.file.html',
    '/filename.php/'],
  nonMatch: ['/', '/windows.PHP'],
}, {
  robots: `
   User-agent: /*.php$
   Allow: /*.php$
   Disallow: /
  `,
  testPath: '/*.php$',
  matches: ['/filename.php', '/folder/filename.php'],
  nonMatch: ['/filename.php?parameters', '/filename.php/', '/filename.php5', '/windows.PHP'],
}, {
  robots: `
   User-agent: /fish*.php
   Allow: /fish*.php
   Disallow: /
  `,
  testPath: '/fish*.php',
  matches: ['/fish.php', '/fishheads/catfish.php?parameters'],
  nonMatch: ['/Fish.PHP'],
}];
