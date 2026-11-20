import React, { useEffect, useState } from "react";
import {
    FileText,
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    TrendingUp,
    Search,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/clients';
import { ENDPOINTS } from '../api/endpoints';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Input } from '../components/common/Input'
import type { DashboardSummaryResponse } from '../types/dashboard';

export const DashboardPage: React.FC = () => {
    const { officerName, activeRole, branch } = useAuth();

    const [data, setData] = useState<DashboardSummaryResponse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchLafNumber, setSearchLafNumber] = useState('');
    const [searchResult, setSearchResult] = useState<any | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleLafSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchLafNumber.trim()) return;
        setIsSearching(true);
        setSearchError(null);
        setSearchResult(null);
        try {
            const response = await apiClient.get(ENDPOINTS.LAF.SEARCH, {
                params: {
                    lafNumber: searchLafNumber.trim(),
                    lafNumberMatchMode: 'contains',
                },
            });
            const items = response.data?.items || response.data?.data || response.data || [];
            if (Array.isArray(items) && items.length > 0) {
                setSearchResult(items[0]);
            } else {
                setSearchError(`No LAF record found matching "${searchLafNumber.trim()}".`);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setSearchError(error.message || 'Error searching for LAF record');
        } finally {
            setIsSearching(false);
        }
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<DashboardSummaryResponse>(
                ENDPOINTS.DASHBOARD.SUMMARY
            );
            setData(response.data);
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to load dashboard metrics');
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">System Dashboard</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Logged in as <span className="font-semibold text-slate-700">{officerName}</span> ({activeRole}) &bull; Branch {branch}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchDashboardData}
                    isLoading={isLoading}
                    className="self-start sm:self-auto gap-2"
                ><RefreshCw className="w-3.5 h-3.5" />
                    Refresh Metrics
                </Button>
            </div>

            {error && (
                <Alert variant="error" title="Dashboard Error">
                    {error}
                </Alert>
            )}

            {/* Quick LAF Lookup Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Search className="w-4 h-4 text-primary" />
                        Quick LAF Record Search
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Instantly inspect the status, customer, and registration details of any LAF number
                    </p>
                </div>

                <form onSubmit={handleLafSearch} className="flex gap-3 max-w-lg">
                    <Input
                        placeholder="Enter LAF Number (e.g. AHB/004/2026)..."
                        value={searchLafNumber}
                        onChange={(e) => setSearchLafNumber(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={isSearching}
                        className="flex-shrink-0"
                    >
                        Search
                    </Button>
                </form>

                {searchError && (
                    <p className="text-xs font-medium text-rose-600">{searchError}</p>
                )}

                {/* Found Record Summary Card */}
                {searchResult && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="font-extrabold text-sm text-slate-900">
                                    {searchResult.lafNumber}
                                </span>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${searchResult.isArchived
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                        }`}
                                >
                                    {searchResult.isArchived ? 'ARCHIVED' : 'ACTIVE'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                                Customer: <span className="font-semibold text-slate-800">{searchResult.customerName}</span> &bull; CIF: {searchResult.cifNumber}
                            </p>
                        </div>
                        <div className="text-xs text-slate-500 sm:text-right">
                            <div>Registered: {new Date(searchResult.registrationDate).toLocaleDateString()}</div>
                            <div>By: <span className="font-semibold text-slate-700">{searchResult.createdBy}</span></div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    LAF Registry Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Registered */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Total Registered</span>
                            <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            {isLoading ? '...' : data?.lafDashboard.totalRegisteredLafs ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Active items in registry</p>
                    </div>

                    {/* Today's Registrations */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Registered Today</span>
                            <Calendar className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            {isLoading ? '...' : data?.lafDashboard.todaysRegistrations ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Logged since midnight</p>
                    </div>

                    {/* Monthly Registrations */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">This Month</span>
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            {isLoading ? '...' : data?.lafDashboard.monthlyRegistrations ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Cumulative month-to-date</p>
                    </div>

                    {/* Last Registered LAF */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Latest LAF ID</span>
                            <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-lg font-bold text-slate-800 truncate">
                            {isLoading ? '...' : data?.lafDashboard.lastRegisteredLaf || 'None'}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Most recent record</p>
                    </div>
                </div>
            </div>

            {/* Section 2: Iteration Registry Statistics */}
            <div>
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Iteration &amp; Rescheduling Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Approved Iterations */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Approved Iterations</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            {isLoading ? '...' : data?.iterationDashboard.totalRegisteredIterations ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Authorized rescheduling workflows</p>
                    </div>

                    {/* Remaining Balance */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Remaining Iterations</span>
                            <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            {isLoading ? '...' : data?.iterationDashboard.totalRemainingIterations ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Sum of all active remaining quotas</p>
                    </div>
                    {/* Fully Utilized */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Fully Utilized</span>
                            <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            {isLoading ? '...' : data?.iterationDashboard.totalFullyUtilizedIterations ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Remaining balance is 0</p>
                    </div>
                    {/* Near Limit Alert */}
                    <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm">
                        <div className="flex items-center justify-between text-rose-700 mb-2">
                            <span className="text-xs font-semibold">Near Maximum Limit</span>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="text-2xl font-extrabold text-rose-700">
                            {isLoading ? '...' : data?.iterationDashboard.iterationsNearMaximumLimit ?? 0}
                        </div>
                        <p className="text-xs text-rose-600/80 mt-1">
                            &le; {data?.iterationDashboard.configuredNearLimitThreshold ?? 1} iterations left
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default DashboardPage;