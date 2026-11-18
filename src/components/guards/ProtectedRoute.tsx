import React from "react";
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth';
import type { AppRole } from "../../types/auth";

interface ProtectedRouteProps {
    allowedRoles?: AppRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, isLoading, activeRole } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 vorder-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && activeRole && !allowedRoles.includes(activeRole)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />;
}

export default ProtectedRoute;