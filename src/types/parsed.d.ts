interface ParsedRobotsTxtBase {
  sitemaps: string[];
  host?: string;
}

declare namespace Parsed {
  export type Agent = {
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

  export type RobotsTxt = ParsedRobotsTxtBase & {
    [agent: string]: Agent;
  };
}
