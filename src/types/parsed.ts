interface ParsedRobotsTxtBase {
  sitemaps: string[];
  host?: string;
}

export type RobotsAgent = {
  allow: {
    specificity: number;
    path: RegExp;
  }[];
  disallow: {
    specificity: number;
    path: RegExp;
  }[];
  crawlDelay: number;
};

export type ParsedRobotsTxt = ParsedRobotsTxtBase & {
  [agent: string]: RobotsAgent;
};
