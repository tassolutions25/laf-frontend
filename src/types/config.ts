export interface SystemConfigItem {
    key: string;
    value: string;
    updatedBy: string | null;
    updatedAt: string;
}

export interface UpdateConfigPayload {
    value: string;
}