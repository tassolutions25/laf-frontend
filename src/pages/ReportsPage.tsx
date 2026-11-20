import React, { useState, useEffect } from 'react';
import {
    FileBarChart,
    Printer,
    Search,
    SlidersHorizontal,
    RotateCcw,
    Calendar,
    X,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import apiClient from '../api/clients';
import { ENDPOINTS } from '../api/endpoints';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import type {
    LafReportItem,
    IterationReportItem,
    ReportResponse,
    LafReportFilterType,
    IterationReportFilterType,
} from '../types/reports';

type ActiveTab = 'laf' | 'iteration';

export const ReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('laf');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const [quickSearch, setQuickSearch] = useState('');
    const [lafNumber, setLafNumber] = useState('');
    const [cifNumber, setCifNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [lafFilterType, setLafFilterType] = useState<LafReportFilterType>('daily');
    const [iterFilterType, setIterFilterType] = useState<IterationReportFilterType>('remaining');

    const [lafData, setLafData] = useState<ReportResponse<LafReportItem> | null>(null);
    const [iterData, setIterData] = useState<ReportResponse<IterationReportItem> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                lafNumber: lafNumber.trim() || undefined,
                cifNumber: cifNumber.trim() || undefined,
                customerName: customerName.trim() || undefined,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                reportType: activeTab === 'laf' ? lafFilterType : iterFilterType,
            };

            if (activeTab === 'laf') {
                const response = await apiClient.get<ReportResponse<LafReportItem>>(
                    ENDPOINTS.REPORTS.LAF,
                    { params }
                );
                setLafData(response.data);
            } else {
                const response = await apiClient.get<ReportResponse<IterationReportItem>>(
                    ENDPOINTS.REPORTS.ITERATION,
                    { params }
                );
                setIterData(response.data);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to generate report');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [activeTab, lafFilterType, iterFilterType]);

    const handleResetFilters = () => {
        setQuickSearch('');
        setLafNumber('');
        setCifNumber('');
        setCustomerName('');
        setFromDate('');
        setToDate('');
        setLafFilterType('daily');
        setIterFilterType('remaining');
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = activeTab === 'laf' ? 'LAF_Registry_Report' : 'Iteration_Registry_Report';
        window.print();
        document.title = originalTitle;
    };

    const filteredLafRecords = lafData?.records?.filter((r) => {
        if (lafNumber && !r.lafNumber?.toLowerCase().includes(lafNumber.toLowerCase().trim())) {
            return false;
        }
        const query = quickSearch.toLowerCase().trim();
        if (!query) return true;
        return (
            r.lafNumber?.toLowerCase().includes(query) ||
            r.customerName?.toLowerCase().includes(query) ||
            r.cifNumber?.includes(query)
        );
    });

    const filteredIterRecords = iterData?.records?.filter((r) => {
        if (lafNumber && !r.lafNumber?.toLowerCase().includes(lafNumber.toLowerCase().trim())) {
            return false;
        }
        const query = quickSearch.toLowerCase().trim();
        if (!query) return true;
        return (
            r.lafNumber?.toLowerCase().includes(query) ||
            r.customerName?.toLowerCase().includes(query) ||
            r.cifNumber?.includes(query)
        );
    });

    const activeFilterCount = [
        lafNumber,
        cifNumber,
        customerName,
        fromDate,
        toDate,
        activeTab === 'laf' ? (lafFilterType !== 'daily' ? lafFilterType : '') : (iterFilterType !== 'remaining' ? iterFilterType : ''),
    ].filter(Boolean).length;

    return (
        <div className="space-y-4 font-sans">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('laf')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'laf'
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        LAF Registry
                    </button>
                    <button
                        onClick={() => setActiveTab('iteration')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'iteration'
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Iteration Registry
                    </button>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Quick search LAF, CIF, Name..."
                            value={quickSearch}
                            onChange={(e) => setQuickSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-light focus:border-primary transition-all"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        {quickSearch && (
                            <button
                                onClick={() => setQuickSearch('')}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${showAdvancedFilters || activeFilterCount > 0
                            ? 'bg-primary-light border-primary-muted text-primary'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                        {showAdvancedFilters ? (
                            <ChevronUp className="w-3 h-3 ml-0.5" />
                        ) : (
                            <ChevronDown className="w-3 h-3 ml-0.5" />
                        )}
                    </button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-1.5 text-xs h-8"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                    </Button>
                </div>
            </div>

            {showAdvancedFilters && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 print:hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                            Advanced Query Filters
                        </h3>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={handleResetFilters}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Reset All
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="w-full space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Category
                            </label>
                            {activeTab === 'laf' ? (
                                <select
                                    value={lafFilterType}
                                    onChange={(e) => setLafFilterType(e.target.value as LafReportFilterType)}
                                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-light"
                                >
                                    <option value="daily">Daily Activity (Today)</option>
                                    <option value="monthly">Monthly Summary</option>
                                    <option value="custom">All / Custom Range</option>
                                </select>
                            ) : (
                                <select
                                    value={iterFilterType}
                                    onChange={(e) =>
                                        setIterFilterType(e.target.value as IterationReportFilterType)
                                    }
                                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-light"
                                >
                                    <option value="remaining">Remaining Iterations (&gt; 0)</option>
                                    <option value="fully_utilized">Fully Utilized (Remaining = 0)</option>
                                    <option value="custom">All / Custom Range</option>
                                </select>
                            )}
                        </div>

                        <Input
                            label="LAF Number"
                            placeholder="e.g. AHB/004..."
                            value={lafNumber}
                            onChange={(e) => setLafNumber(e.target.value)}
                            className="text-xs py-1.5"
                        />

                        <Input
                            label="CIF Number"
                            placeholder="Filter by CIF..."
                            value={cifNumber}
                            onChange={(e) => setCifNumber(e.target.value)}
                            className="text-xs py-1.5"
                        />

                        <Input
                            label="Customer Name"
                            placeholder="Filter by Name..."
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
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
                            variant="primary"
                            size="sm"
                            onClick={fetchReport}
                            isLoading={isLoading}
                            className="text-xs px-5"
                        >
                            Apply Filter Query
                        </Button>
                    </div>
                </div>
            )}

            {(quickSearch || activeFilterCount > 0) && (
                <div className="flex items-center gap-2 flex-wrap text-xs print:hidden">
                    <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>
                    {quickSearch && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-medium">
                            Search: "{quickSearch}"
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setQuickSearch('')} />
                        </span>
                    )}
                    {lafNumber && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                            LAF: {lafNumber}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setLafNumber('')} />
                        </span>
                    )}
                    {cifNumber && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                            CIF: {cifNumber}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setCifNumber('')} />
                        </span>
                    )}
                    {customerName && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                            Customer: {customerName}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setCustomerName('')} />
                        </span>
                    )}
                    {(fromDate || toDate) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-medium">
                            Date: {fromDate || '...'} &rarr; {toDate || '...'}
                            <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => {
                                    setFromDate('');
                                    setToDate('');
                                }}
                            />
                        </span>
                    )}
                    <button
                        onClick={handleResetFilters}
                        className="text-[11px] text-slate-500 hover:text-rose-600 underline ml-1"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {error && (
                <Alert variant="error" title="Report Generation Error">
                    {error}
                </Alert>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden print:border-none print:shadow-none">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center print:bg-transparent">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <FileBarChart className="w-4 h-4 text-primary print:hidden" />
                            {activeTab === 'laf' ? lafData?.title : iterData?.title}
                        </h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Generated By:{' '}
                            <span className="font-semibold text-slate-700">
                                {activeTab === 'laf' ? lafData?.generatedBy : iterData?.generatedBy}
                            </span>{' '}
                            &bull; Total Records:{' '}
                            <span className="font-semibold text-slate-700">
                                {activeTab === 'laf'
                                    ? filteredLafRecords?.length ?? 0
                                    : filteredIterRecords?.length ?? 0}
                            </span>
                        </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date().toLocaleDateString()}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === 'laf' ? (
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">S/N</th>
                                    <th className="py-3 px-4">LAF Number</th>
                                    <th className="py-3 px-4">CIF Number</th>
                                    <th className="py-3 px-4">Customer Name</th>
                                    <th className="py-3 px-4">Registration Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLafRecords && filteredLafRecords.length > 0 ? (
                                    filteredLafRecords.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="py-3 px-4 font-mono">{r.serialNumber || i + 1}</td>
                                            <td className="py-3 px-4 font-bold text-slate-900">{r.lafNumber}</td>
                                            <td className="py-3 px-4">{r.cifNumber}</td>
                                            <td className="py-3 px-4 font-medium text-slate-800">{r.customerName}</td>
                                            <td className="py-3 px-4 text-slate-500">
                                                {new Date(r.registrationDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            {isLoading ? 'Generating report...' : 'No matching records found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">S/N</th>
                                    <th className="py-3 px-4">LAF Number</th>
                                    <th className="py-3 px-4">CIF</th>
                                    <th className="py-3 px-4">Customer Name</th>
                                    <th className="py-3 px-4">Original LAF</th>
                                    <th className="py-3 px-4 text-center">Allowed</th>
                                    <th className="py-3 px-4 text-center">Rescheduled</th>
                                    <th className="py-3 px-4 text-center font-bold text-primary">Remaining</th>
                                    <th className="py-3 px-4">Approved At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredIterRecords && filteredIterRecords.length > 0 ? (
                                    filteredIterRecords.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="py-3 px-4 font-mono">{r.serialNumber || i + 1}</td>
                                            <td className="py-3 px-4 font-bold text-slate-900">{r.lafNumber || '-'}</td>
                                            <td className="py-3 px-4">{r.cifNumber}</td>
                                            <td className="py-3 px-4 font-medium text-slate-800">{r.customerName}</td>
                                            <td className="py-3 px-4 text-slate-500">{r.originalLafNumber}</td>
                                            <td className="py-3 px-4 text-center">{r.allowedRescheduling}</td>
                                            <td className="py-3 px-4 text-center">{r.timesRescheduled}</td>
                                            <td className="py-3 px-4 text-center font-bold text-primary">
                                                {r.remainingIteration}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500">
                                                {r.approvedAt ? new Date(r.approvedAt).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-slate-400">
                                            {isLoading ? 'Generating report...' : 'No matching iteration records found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;