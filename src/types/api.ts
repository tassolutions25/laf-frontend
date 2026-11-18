export interface PaginationResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
}

export interface ApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string;
}