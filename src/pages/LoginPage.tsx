import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import type { LoginCredentials } from "../types/auth";

const loginSchema = z.object({
    username: z.string().min(1, 'User ID is Required').trim(),
    password: z.string().min(1, 'Password is required')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSeatConflict, setIsSeatConflict] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const onSubmit = async (data: LoginFormData) => {
        setErrorMessage(null);
        setIsSeatConflict(false);

        try {
            const credentials: LoginCredentials = {
                username: data.username,
                password: data.password,
            }
            await login(credentials);

            navigate(from, { replace: true });
        } catch (err: unknown) {
            const error = err as Error;
            const message = error.message || 'Authentication failed. Please try again';
            setErrorMessage(message);

            if (message.toLowerCase().includes('currently being used') || message.toLowerCase().includes('seat')) {
                setIsSeatConflict(true)
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-brand-900/20">L</div>
                </div>
                <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
                    LAF Registry System
                </h2>
                <p className="mt-1 text-center text-xs font-medium text-slate-500 uppercase tracking-widest">
                    Officer Portal
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10 space-y-6">
                    {errorMessage && (
                        <Alert
                            variant={isSeatConflict ? 'warning' : 'error'}
                            title={isSeatConflict ? 'System Seat Occupied' : 'Sign In Failed'}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <div className="relative">
                                <Input
                                    label="User ID"
                                    placeholder="='e.g AHB001"
                                    error={errors.username?.message}
                                    disabled={isSubmitting}
                                    {...register('username')}
                                />
                                <div className="absolute right-3 top-8 pointer-events-none text-slate-400">
                                    <User className="w-4 w-4" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <Input
                                    label='Password'
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    error={errors.password?.message}
                                    disabled={isSubmitting}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 flex items-start gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Sessions are locked to a single active user seat. Logging in claims the seat for up to 15 minutes of idle time.
                            </p>
                        </div>
                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={isSubmitting}
                                className="w-full py-2.5 font-semibold text-sm shadow-md">
                                {isSubmitting ? 'Verifying User...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>
                </div>
                <p className="text-center text-xs text-slate-400 mt-6">
                    {/* Dual-Control Lost & Found Workflow System &bull; Maker &amp; Checker */}
                </p>
            </div>
        </div>
    );
};

export default LoginPage;