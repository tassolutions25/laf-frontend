import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'

import apiClient, { STORAGE_KEYS } from '../api/clients';
import { ENDPOINTS } from '../api/endpoints';
import { type AuthUser, type AppRole, type LoginCredentials, type LoginResponse, normalizeRoles } from '../types/auth';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    activeRole: AppRole | null;
    login: (credentials: LoginCredentials) => Promise<AuthUser>;
    logout: () => Promise<void>;
    switchActiveRole: (role: AppRole) => void;
    sendHeartbeat: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HEARTBEAT_INTERVAL_MS = 4 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [activeRole, setActiveRole] = useState<AppRole | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const sendHeartbeat = useCallback(async () => {
        if (!user) return;
        try {
            await apiClient.post(ENDPOINTS.SESSION.EXTEND, { username: user.username });
        } catch (error) {
            console.warn('Session heartbeat failed or expired:', error);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            if (heartbeatTimerRef.current) {
                clearInterval(heartbeatTimerRef.current);
                heartbeatTimerRef.current = null;
            }
            return
        }

        heartbeatTimerRef.current = setInterval(() => {
            sendHeartbeat();
        }, HEARTBEAT_INTERVAL_MS);

        return () => {
            if (heartbeatTimerRef.current) {
                clearInterval(heartbeatTimerRef.current);
            }
        };
    }, [user, sendHeartbeat])

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER);
            const storedTicket = sessionStorage.getItem(STORAGE_KEYS.TICKET);

            if (storedUser && storedTicket) {
                const parsedUser: AuthUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setActiveRole(parsedUser.roles[0] || null);
            }
        } catch (e) {
            console.error('Failed to parse stored user session:', e);
            sessionStorage.removeItem(STORAGE_KEYS.USER);
            sessionStorage.removeItem(STORAGE_KEYS.TICKET)
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
            const raw = response.data
            const normalized = normalizeRoles(raw.roles);

            const authenticatedUser: AuthUser = {
                username: raw.username,
                fullName: raw.fullName,
                roles: normalized,
                rawRoles: raw.roles,
                branch: raw.branch,
                ticket: raw.ticket,
                sessionExpiresAt: raw.sessionExpiresAt,
            };

            setUser(authenticatedUser);
            setActiveRole(normalized[0] || null);
            sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authenticatedUser));
            sessionStorage.setItem(STORAGE_KEYS.TICKET, raw.ticket);

            return authenticatedUser;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        const currentUsername = user?.username;
        try {
            if (currentUsername) {
                await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {
                    username: currentUsername
                });
            }
        } catch (error) {
            console.warn('Error releasing seat during logout: ', error);
        } finally {
            setUser(null);
            setActiveRole(null);
            sessionStorage.removeItem(STORAGE_KEYS.USER);
            sessionStorage.removeItem(STORAGE_KEYS.TICKET);
        }
    };

    const switchActiveRole = (role: AppRole) => {
        if (user?.roles.includes(role)) {
            setActiveRole(role);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: Boolean(user),
            isLoading,
            activeRole,
            login,
            logout,
            switchActiveRole,
            sendHeartbeat,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}
