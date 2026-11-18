export interface RegisterLafPayload {
    cifNumber: string;
    customerName: string;
    prefix?: string;
}

export interface SearchLafParams {
    lafNumber?: string;
    lafNumberMatchMode?: 'equals' | 'contains' | 'startsWith';
    customerName?: string;
    cifNumber?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface ArchiveLafPayload {
    archiveReason: string;
}

export interface LafRecord {
    id: string;
    serialNumber: number;
    lafNumber: string;
    cifNumber: string;
    customerName: string;
    registrationDate: string;
    effectiveApprovalDate?: string;
    createdBy: string;
    isArchived: boolean;
    archivedAt?: string;
    archivedBy?: string;
}

export interface LafSuggestionResponse {
    suggestion: string;
}
