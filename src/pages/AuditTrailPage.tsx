import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ShieldAlert,
    Search,
    Filter,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
} from 'lucide-react';
import apiClient from '../api/clients';
import { ENDPOINTS } from '../api/endpoints';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import type {
    AuditLogItem,
    AuditSearchResponse,
} from '../types/audit';


export const AuditTrailPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [activity, setActivity] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const [data, setData] = useState<AuditSearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAuditLogs = useCallback(
        async (
            pageToFetch = 1,
            overrideFilters?: {
                user?: string;
                act?: string;
                from?: string;
                to?: string;
            }
        ) => {
            setIsLoading(true);
            setError(null);

            const targetUsername =
                overrideFilters?.user !== undefined ? overrideFilters.user : username;
            const targetActivity =
                overrideFilters?.act !== undefined ? overrideFilters.act : activity;
            const targetFrom =
                overrideFilters?.from !== undefined ? overrideFilters.from : fromDate;
            const targetTo =
                overrideFilters?.to !== undefined ? overrideFilters.to : toDate;

            try {
                const response = await apiClient.get<AuditSearchResponse>(
                    ENDPOINTS.AUDIT.SEARCH,
                    {
                        params: {
                            username: targetUsername.trim() || undefined,
                            activity: targetActivity.trim() || undefined,
                            fromDate: targetFrom || undefined,
                            toDate: targetTo || undefined,
                            page: pageToFetch,
                            limit: pageSize,
                        },
                    }
                );
                setData(response.data);
                setCurrentPage(pageToFetch);
            } catch (err: unknown) {
                const error = err as Error;
                setError(error.message || 'Failed to retrieve system audit logs');
            } finally {
                setIsLoading(false);
            }
        },
        [username, activity, fromDate, toDate]
    );

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchAuditLogs(1);
        }, 350);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [username, activity, fromDate, toDate, fetchAuditLogs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        fetchAuditLogs(1);
    };

    const handleReset = () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        setUsername('');
        setActivity('');
        setFromDate('');
        setToDate('');
        fetchAuditLogs(1, { user: '', act: '', from: '', to: '' });
    };
    const getActivityBadge = (act: string) => {
        const upper = act.toUpperCase();
        if (upper.includes('SUCCESS') || upper.includes('APPROVE')) {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
        if (upper.includes('FAIL') || upper.includes('REJECT') || upper.includes('LOCKED')) {
            return 'bg-rose-50 text-rose-700 border-rose-200';
        }
        if (upper.includes('SESSION') || upper.includes('CLAIM') || upper.includes('RELEASE')) {
            return 'bg-amber-50 text-amber-700 border-amber-200';
        }
        return 'bg-blue-50 text-blue-700 border-blue-200';
    };

    return (
        <div className="space-y-5 font-sans">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        System Audit Trail
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Immutable log of all officer activities, authentication attempts, and authorization decisions
                    </p>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    {isLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>Total Logged Entries: </span>
                    <span className="font-bold text-slate-800">{data?.total ?? 0}</span>
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <form onSubmit={handleSearch} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Filter className="w-3.5 h-3.5 text-primary" />
                            Filter Logs
                        </span>
                        {(username || activity || fromDate || toDate) && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Reset Filters
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Input
                            label="Officer User ID"
                            placeholder="e.g. admin or testMaker..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-xs py-1.5"
                        />
                        <Input
                            label="Activity Keyword"
                            placeholder="e.g. LOGIN, APPROVE..."
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            className="text-xs py-1.5"
                        />
                        <Input
                            label="From Date"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="text-xs py-1.5"
                        />
                        <Input
                            label="To Date"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="text-xs py-1.5"
                        />
                    </div>
                    <div className="flex justify-end pt-1">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="text-xs w-32 justify-center gap-1.5"
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span>Search Logs</span>
                        </Button>
                    </div>
                </form>
            </div>
            {error && (
                <Alert variant="error" title="Audit Query Error">
                    {error}
                </Alert>
            )}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4">Officer</th>
                                <th className="py-3 px-4">Activity</th>
                                <th className="py-3 px-4">Event Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data?.items && data.items.length > 0 ? (
                                data.items.map((log: AuditLogItem) => (
                                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                {log.username}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getActivityBadge(
                                                    log.activity
                                                )}`}
                                            >
                                                {log.activity}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 leading-relaxed font-sans">
                                            {log.details || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400">
                                        {isLoading ? 'Querying audit records...' : 'No audit entries match the current filter criteria.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {data && data.totalPages > 1 && (
                    <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div>
                            Page <span className="font-semibold text-slate-800">{data.page}</span> of{' '}
                            <span className="font-semibold text-slate-800">{data.totalPages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={data.page <= 1 || isLoading}
                                onClick={() => fetchAuditLogs(data.page - 1)}
                                className="text-xs h-7 px-2.5"
                            >
                                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={data.page >= data.totalPages || isLoading}
                                onClick={() => fetchAuditLogs(data.page + 1)}
                                className="text-xs h-7 px-2.5"
                            >
                                Next
                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AuditTrailPage;