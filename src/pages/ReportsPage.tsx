import React, { useState, useEffect } from 'react';
import {
    FileBarChart,
    Printer,
    Search,
    Filter,
    Calendar,
    Layers,
    Clock,
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
    IterationReportFilterType
} from '../types/reports';

type ActiveTab = 'laf' | 'iteration';

export const ReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('laf');

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
                    ENDPOINTS.REPORTS.LAF, { params }
                );
                setLafData(response.data);
            } else {
                const response = await apiClient.get<ReportResponse<IterationReportItem>>(
                    ENDPOINTS.REPORTS.ITERATION, { params }
                );
                setIterData(response.data);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to generate report')
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchReport();
    }, [activeTab, lafFilterType, iterFilterType]);

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = activeTab === 'laf' ? 'LAF_Registry_Report' : 'Iteration_Registry_Report';
        window.print();
        document.title = originalTitle;
    };

    const filteredLafRecords = lafData?.records?.filter((r) =>
        lafNumber ? r.lafNumber?.toLowerCase().includes(lafNumber.toLowerCase().trim()) : true
    );

    const filteredIterRecords = iterData?.records?.filter((r) =>
        lafNumber ? r.lafNumber?.toLowerCase().includes(lafNumber.toLowerCase().trim()) : true
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm print:hidden">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileBarChart className="w-5 h-5 text-primary" />
                        Official Registry Reports
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Generate and print verified audit reports for LAF Registrations and Iterations
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Print Report
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit print:hidden">
                <button
                    onClick={() => setActiveTab('laf')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'laf'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <Layers className="w-4 h-4" />
                    LAF Registry Reports
                </button>
                <button
                    onClick={() => setActiveTab('iteration')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'iteration'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    Iteration &amp; Rescheduling Reports
                </button>
            </div>
            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 print:hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Filter className="w-3.5 h-3.5 text-primary" />
                    Filter Parameters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Report Type selector */}
                    <div className="w-full space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Type
                        </label>
                        {activeTab === 'laf' ? (
                            <select
                                value={lafFilterType}
                                onChange={(e) => setLafFilterType(e.target.value as LafReportFilterType)}
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                            >
                                <option value="daily">Daily Activity (Today)</option>
                                <option value="monthly">Monthly Summary</option>
                                <option value="custom">All / Custom Date Range</option>
                            </select>
                        ) : (
                            <select
                                value={iterFilterType}
                                onChange={(e) =>
                                    setIterFilterType(e.target.value as IterationReportFilterType)
                                }
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                            >
                                <option value="remaining">Remaining Iterations (&gt; 0)</option>
                                <option value="fully_utilized">Fully Utilized (Remaining = 0)</option>
                                <option value="custom">All / Custom Date Range</option>
                            </select>
                        )}
                    </div>


                    <Input
                        label="LAF Number"
                        placeholder="e.g. AHB/004/2026..."
                        value={lafNumber}
                        onChange={(e) => setLafNumber(e.target.value)}
                    />

                    <Input
                        label="CIF Number"
                        placeholder="Search CIF..."
                        value={cifNumber}
                        onChange={(e) => setCifNumber(e.target.value)}
                    />
                    <Input
                        label="Customer Name"
                        placeholder="Search Name..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <Input
                        label="From Date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <Input
                        label="To Date"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={fetchReport}
                        isLoading={isLoading}
                        className="gap-2"
                    >
                        <Search className="w-3.5 h-3.5" />
                        Apply Filters
                    </Button>
                </div>
            </div>
            {error && (
                <Alert variant="error" title="Report Generation Error">
                    {error}
                </Alert>
            )}

            {/* Printable Report Document */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden print:border-none print:shadow-none">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                {activeTab === 'laf' ? lafData?.title : iterData?.title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Generated By:{' '}
                                <span className="font-semibold text-slate-700">
                                    {activeTab === 'laf' ? lafData?.generatedBy : iterData?.generatedBy}
                                </span>{' '}
                                &bull; Total Records:{' '}
                                <span className="font-semibold text-slate-700">
                                    {activeTab === 'laf' ? lafData?.totalRecords : iterData?.totalRecords}
                                </span>
                            </p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                            <span className="flex items-center gap-1 justify-end">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    {activeTab === 'laf' ? (
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">S.No</th>
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
                                            <td className="py-3 px-4 font-medium text-slate-800">
                                                {r.customerName}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500">
                                                {new Date(r.registrationDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            {isLoading ? 'Generating report...' : 'No records found for the selected criteria.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">S.No</th>
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
                                        <td colSpan={9} className="py-8 text-center text-slate-400">
                                            {isLoading ? 'Generating report...' : 'No iteration records found for the selected criteria.'}
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