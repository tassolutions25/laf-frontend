import React from 'react';
import type { IterationStatus } from '../../types/iteration';

type StatusType = IterationStatus | 'ACTIVE' | 'ARCHIVED' | string;

interface StatusBadgeProps {
    status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStyle = () => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
            case 'ACTIVE':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'REJECTED':
            case 'ARCHIVED':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;