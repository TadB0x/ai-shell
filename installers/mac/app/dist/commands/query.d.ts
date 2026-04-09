export interface QueryOptions {
    copy: boolean;
    provider?: string;
    yes: boolean;
}
export declare function runQuery(query: string, opts: QueryOptions): Promise<void>;
