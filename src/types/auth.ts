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
    const roles = new Set<AppRole>();

    for (const raw of rawRoles) {
        const upper = (raw || '').toUpperCase();

        if (upper === 'DEVMKR' || upper === 'LAF_MAKER') {
            roles.add('MAKER')
        }

        if (upper === 'DEVCHKR' || upper === 'LAF_CHECKER') {
            roles.add('CHECKER');
            roles.add('ADMIN')
        }

        if (upper === 'ADMIN') {
            roles.add("ADMIN")
        }
    }

    return Array.from(roles)
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