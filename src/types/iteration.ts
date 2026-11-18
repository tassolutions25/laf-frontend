export type IterationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReviewAction = 'APPROVE' | 'REJECT';

export interface RequestIterationPayload {
    cifNumber: string;
    customerName: string;
    originalLafNumber: string;
    previousLafNumber: string;
    allowedRescheduling: number;
    timeRescheduled: number;
}

export interface ReviewIterationPayload {
    action: ReviewAction;
    remarks: string;
}

export interface SearchIterationParams {
    lafNumber?: string;
    cifNumber?: string;
    customerName?: string;
    status?: IterationStatus;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface IterationRecord {
    id: string;
    serialNumber?: number;
    status: IterationStatus;
    lafNumber?: string;
    cifNumber: string;
    customerName: string;
    originalLafNumber: string;
    previousLafNumber?: string;
    allowedRescheduling: number;
    timesRescheduled: number;
    remainingIteration: number;
    makerUsername?: string;
    checkerUsername?: string;
    checkerRemarks?: string;
    createdAt: string;
    reviewedAt?: string;
}
