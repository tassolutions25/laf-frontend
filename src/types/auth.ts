export type RawUserRole = 'DEVMKR' | 'DEVCHKR' | 'LAF_MAKER' | 'LAF_CHECKER' | 'ADMIN';

export type AppRole = 'MAKER' | 'CHECKER' | 'ADMIN';

export const ROLE_MAP: Record<RawUserRole, AppRole> = {
    DEVMKR: 'MAKER',
    LAF_MAKER: 'MAKER',
    DEVCHKR: 'CHECKER',
    LAF_CHECKER: 'CHECKER',
    ADMIN: 'ADMIN',
};

export function normalizeRoles(rawRoles: string[]):
    AppRole[] {
    const normalized = rawRoles
        .map((role) => ROLE_MAP[role as RawUserRole])
        .filter((role): role is AppRole => Boolean(role));

    return Array.from(new Set(normalized));
}

export interface AuthUser {
    username: string;
    fullName: string;
    roles: AppRole[];
    rawRoles: string[];
    branch: string;
    ticket: string;
    sessionExpiresAt: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    username: string;
    fullName: string;
    roles: string[];
    branch: string;
    ticket: string;
    sessionExpiresAt: string;
}

export interface LogoutPayload {
    username: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    activeRole: AppRole | null;
}