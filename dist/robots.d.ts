import { ParsedRobotsTxt, RobotOptions, RobotsAgent } from './types';
declare class Robots {
    active: string;
    robotsCache: Record<string, ParsedRobotsTxt>;
    opts: RobotOptions;
    constructor(opts?: Partial<RobotOptions>);
    getRecordsForAgent(): false | RobotsAgent;
    canVisit(url: string, botGroup: RobotsAgent): boolean;
    parseRobots(url: string, string: string): void;
    fetch(link: string): Promise<ParsedRobotsTxt>;
    isCached(domain: string): boolean;
    useRobotsFor(url: string, callback?: () => unknown): unknown;
    canCrawl(url: string, callback?: (crawlable: boolean) => unknown): unknown;
    canCrawlSync(url: string): boolean;
    getSitemaps(callback?: (sitemaps: string[]) => unknown): unknown;
    getSitemapsSync(): string[];
    getCrawlDelay(callback?: (crawlDelay: number) => unknown): unknown;
    getCrawlDelaySync(): number;
    getCrawlableLinks(linkArray: string[], callback?: (crawlableLinks: string[]) => unknown): unknown;
    getCrawlableLinksSync(linkArray: string[] | string): string[];
    getPreferredHost(callback?: (host?: string) => unknown): Promise<string | undefined>;
    getPreferredHostSync(): string | undefined;
    setUserAgent(agent: string): void;
    setAllowOnNeutral(allow: boolean): void;
    clearCache(): void;
}
export = Robots;
