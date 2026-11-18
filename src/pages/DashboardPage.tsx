import React from "react";
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
    const { officerName, activeRole, branch } = useAuth();

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, {officerName} ({activeRole} - Branch {branch})</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-600 text-sm">later...</p>
            </div>
        </div>
    );
};

export default DashboardPage;