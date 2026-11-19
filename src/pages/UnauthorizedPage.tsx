import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export const UnauthorizedPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
                <p className="text-sm text-slate-500 mt-2">Your current role doesn't have authorization to ciew this resource</p>
                <Link to="/dashboard" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;