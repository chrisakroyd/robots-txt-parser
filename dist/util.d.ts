export declare const hasHttpProtocol: (protocol: string) => boolean;
export declare const addProtocol: (link: string) => string;
export declare const isFunction: (value: unknown) => boolean;
export declare const formatLink: (rawLink: string) => string;
export declare const applyRecords: (path: string, records: {
    specificity: number;
    path: RegExp;
}[]) => {
    numApply: number;
    maxSpecificity: number;
};
