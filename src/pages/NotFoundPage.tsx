import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
                <p className="text-slate-600 mt-2">Page Not Found</p>
                <Link
                    to="/dashboard"
                    className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}