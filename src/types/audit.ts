export interface AuditLogItem {
    id: string;
    username: string;
    activity: string;
    details: string;
    timestamp: string;
}

export interface SearchAuditParams {
    username?: string;
    activity?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}
export interface AuditSearchResponse {
    items: AuditLogItem[];
    total: number;
    page: number;
    totalPages: number;
}