export interface QueryOptions {
    copy: boolean;
}
export declare function runQuery(query: string, opts: QueryOptions): Promise<void>;
