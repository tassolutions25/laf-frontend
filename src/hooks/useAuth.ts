import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AppRole } from "../types/auth";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, activeRole } = context;

    const isMaker = activeRole === 'MAKER';
    const isChecker = activeRole === 'CHECKER';
    const isAdmin = activeRole === 'ADMIN';

    const hasRole = (role: AppRole): boolean => {
        return Boolean(user?.roles.includes(role));
    }

    const canSwitchRole = Boolean(user && user.roles.length > 1);

    return {
        ...context,
        isMaker,
        isChecker,
        isAdmin,
        hasRole,
        canSwitchRole,
        branch: user?.branch || '',
        officerName: user?.fullName || user?.username || '',
    };
};

export default useAuth;