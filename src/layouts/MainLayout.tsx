import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FilePlus,
    Clock,
    Search,
    FileBarChart,
    ShieldCheck,
    Settings,
    LogOut,
    Building2,
    UserCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { AppRole } from "../types/auth";

export const MainLayout: React.FC = () => {
    const {
        user,
        activeRole,
        canSwitchRole,
        switchActiveRole,
        logout,
        branch,
        officerName,
    } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login')
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans print:h-auto print:overflow-visible">
            {/* sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800 print:hidden">
                {/* brand */}
                <div className="h-24  pt-8 flex ite,s-center px-6 bg-slate-950 gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                        L
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-wide">LAF System</h1>
                        <p className="text-xs text-slate-400">Registry & verification</p>
                    </div>
                </div>
                {/* navigation items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}>
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </NavLink>

                    {/* maker navigation */}
                    {activeRole === 'MAKER' && (
                        <>
                            <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Maker Actions
                            </div>
                            <NavLink to="/registry/new" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg rext-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                            >
                                <FilePlus className="w-4 h-4" />
                                New Registration
                            </NavLink>
                            <NavLink to="/iterations/request" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bf-slate-800 hover:text-white'
                                }`}>
                                <Clock className="w-4 h-4" />
                                Request Iteration
                            </NavLink>
                        </>
                    )}
                    {/* checker navigation */}

                    {activeRole === 'CHECKER' && (
                        <>
                            <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Checker Actions
                            </div>
                            <NavLink to="/iterations/pending" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Pending Approvals
                            </NavLink>
                        </>
                    )}

                    {/* search */}
                    <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Records
                    </div>
                    <NavLink to="/registry/search" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary texy-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}>
                        <Search className="w-4 h-4" />
                        Registry Search
                    </NavLink>
                    <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}>
                        <FileBarChart className="w-4 h-4" />
                        Reports
                    </NavLink>

                    {/* Admin navigation */}
                    {(activeRole === 'ADMIN' || user?.roles.includes('ADMIN')) && (
                        <>
                            <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                System
                            </div>
                            <NavLink to="/audit-trail" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}>
                                <UserCheck className="w-4 h-4" />
                                Audit Trail
                            </NavLink>
                            <NavLink to="/config" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'

                                }`}>
                                <Settings className="w-4 h-4" />
                                Configuration
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* sidebar footer */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                    <div className="truncate">
                        <p className="text-sm font-semibold text-white truncate">{officerName}</p>
                        <p className="text-xs text-slate-400">Branch:{branch}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Log out"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* main container */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* header */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 print:hidden">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            Branch {branch}
                        </span>

                        {/* active role badge */}
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${activeRole === 'MAKER' ? 'bg-primary-light text-primary border border-primary-muted' :
                            activeRole === 'CHECKER' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>{activeRole}</span>
                    </div>
                    {/* role switcher */}
                    {canSwitchRole && (
                        <div className="flex items-cennter gap-2">
                            <span className="text-xs text-slate-500 font-medium">Switch Role:</span>
                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                {user?.roles.map((r: AppRole) => (
                                    <button key={r} onClick={() => switchActiveRole(r)} className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${activeRole === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                        }`}>{r}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </header>
                <main className="flex-1 p-6 overflow-y-auto print:p-0 print:overflow-visible">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}