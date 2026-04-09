export interface QueryOptions {
    copy: boolean;
    provider?: string;
}
export declare function runQuery(query: string, opts: QueryOptions): Promise<void>;
