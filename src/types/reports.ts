export type LafReportFilterType = 'daily' | 'monthly' | 'custom';
export type IterationReportFilterType = 'remaining' | 'fully_utilized' | 'custom';

export interface ReportFilterParams {
    reportType?: string;
    cifNumber?: string;
    customerName?: string;
    fromDate?: string;
    toDate?: string;
}

export interface LafReportItem {
    serialNumber: number;
    lafNumber: string;
    cifNumber: string;
    customerName: string;
    registrationDate: string;
}

export interface IterationReportItem {
    serialNumber: number;
    lafNumber?: string;
    cifNumber: string;
    customerName: string;
    originalLafNumber: string;
    allowedRescheduling: number;
    timesRescheduled: number;
    remainingIteration: number;
    approvedAt?: string;
}

export interface ReportFilterParams {
    reportType?: string;
    lafNumber?: string;
    cifNumber?: string;
    customerName?: string;
    fromDate?: string;
    toDate?: string;
}

export interface ReportResponse<T> {
    title: string;
    filterApplied: string;
    totalRecords: number;
    generatedAt: string;
    generatedBy: string;
    records: T[];
}