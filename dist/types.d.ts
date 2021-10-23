export declare type RobotOptions = {
    userAgent: string;
    allowOnNeutral: boolean;
    timeout: number;
};
interface ParsedRobotsTxtBase {
    sitemaps: string[];
    host?: string;
}
export declare type RobotsAgent = {
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
export declare type ParsedRobotsTxt = ParsedRobotsTxtBase & {
    [agent: string]: RobotsAgent;
};
export {};
