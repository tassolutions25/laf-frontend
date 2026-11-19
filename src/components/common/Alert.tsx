import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    variant = 'info',
    title,
    children,
    className = '',
}) => {
    const config = {
        info: {
            bg: 'bg-primary-muted border-primary-light text-primary',
            icon: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
        },
        success: {
            bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            icon: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200 text-amber-800',
            icon: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
        },
        error: {
            bg: 'bg-rose-50 border-rose-200 text-rose-800',
            icon: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
        },
    };

    const { bg, icon } = config[variant];

    return (
        <div className={`p-4 rounded-xl border flex gap-3 text-sm ${bg} ${className}`}>
            {icon}
            <div className="flex-1">
                {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
                <div className="text-xs leading-relaxed">{children}</div>
            </div>
        </div>
    );
};

export default Alert;