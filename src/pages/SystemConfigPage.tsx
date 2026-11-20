import React, { useState, useEffect } from 'react';
import {
    Settings,
    Edit2,
    RefreshCw,
    CheckCircle2,
    Clock,
    User,
    Hash,
    FileCode,
} from 'lucide-react';
import apiClient from '../api/clients';
import { ENDPOINTS } from '../api/endpoints';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import type { SystemConfigItem, UpdateConfigPayload } from '../types/config';

export const SystemConfigPage: React.FC = () => {
    const [configs, setConfigs] = useState<SystemConfigItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [editingConfig, setEditingConfig] = useState<SystemConfigItem | null>(null);
    const [editValue, setEditValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const fetchConfigs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<SystemConfigItem[]>(ENDPOINTS.CONFIG.BASE);
            setConfigs(response.data);
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to retrieve system configurations');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const openEditModal = (item: SystemConfigItem) => {
        setEditingConfig(item);
        setEditValue(item.value);
        setEditError(null);
    };

    const closeEditModal = () => {
        setEditingConfig(null);
        setEditValue('');
        setEditError(null);
    };

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingConfig) return;

        if (!editValue.trim()) {
            setEditError('Configuration value cannot be empty');
            return;
        }

        setIsSaving(true);
        setEditError(null);

        try {
            const payload: UpdateConfigPayload = { value: editValue.trim() };
            await apiClient.put(ENDPOINTS.CONFIG.BY_KEY(editingConfig.key), payload);

            setSuccessMsg(`Parameter "${editingConfig.key}" successfully updated.`);
            setTimeout(() => setSuccessMsg(null), 4000);

            closeEditModal();
            fetchConfigs();
        } catch (err: unknown) {
            const error = err as Error;
            setEditError(error.message || 'Failed to update parameter value');
        } finally {
            setIsSaving(false);
        }
    };

    const getConfigDescription = (key: string) => {
        switch (key) {
            case 'NEAR_LIMIT_THRESHOLD':
                return 'Remaining iteration quota threshold that triggers warning badges on the dashboard and reports.';
            case 'DEFAULT_LAF_PREFIX':
                return 'Standard reference prefix prepended to newly generated LAF sequential numbers (e.g. AHB/001/2026).';
            default:
                return 'System operational configuration parameter.';
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        System Configuration
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Global operational parameters, prefixes, and business threshold rules
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchConfigs}
                    isLoading={isLoading}
                    className="gap-2 self-start sm:self-auto text-xs"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh Parameters
                </Button>
            </div>

            {successMsg && (
                <Alert variant="success" title="Parameter Updated">
                    {successMsg}
                </Alert>
            )}

            {error && (
                <Alert variant="error" title="Configuration Error">
                    {error}
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {configs.map((cfg) => (
                    <div
                        key={cfg.key}
                        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                    >
                        <div>
                            <div className="flex items-start justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                    {cfg.key.includes('PREFIX') ? (
                                        <FileCode className="w-3.5 h-3.5 text-primary" />
                                    ) : (
                                        <Hash className="w-3.5 h-3.5 text-amber-600" />
                                    )}
                                    {cfg.key}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModal(cfg)}
                                    className="text-xs h-7 px-2.5 gap-1 text-slate-700 hover:text-primary"
                                >
                                    <Edit2 className="w-3 h-3" />
                                    Edit
                                </Button>
                            </div>

                            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                                {getConfigDescription(cfg.key)}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <div className="flex items-baseline justify-between">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Configured Value
                                </span>
                                <span className="text-base font-extrabold text-primary font-mono">
                                    {cfg.value}
                                </span>
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3 text-slate-400" />
                                    Updated by: <strong className="text-slate-600">{cfg.updatedBy || 'SYSTEM'}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {new Date(cfg.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={Boolean(editingConfig)}
                onClose={closeEditModal}
                title={`Edit ${editingConfig?.key}`}
                footer={
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={closeEditModal}
                            disabled={isSaving}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSaveConfig}
                            isLoading={isSaving}
                            className="text-xs px-4"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Save Changes
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSaveConfig} className="space-y-4">
                    <p className="text-xs text-slate-500">
                        {editingConfig && getConfigDescription(editingConfig.key)}
                    </p>

                    {editError && (
                        <Alert variant="error" title="Validation Error">
                            {editError}
                        </Alert>
                    )}

                    <Input
                        label="Parameter Value"
                        placeholder="Enter new value..."
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        disabled={isSaving}
                        autoFocus
                    />
                </form>
            </Modal>
        </div>
    );
};

export default SystemConfigPage;