import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/guards/ProtectedRoute'
import { PublicRoute } from './components/guards/PublicRoute'
import { MainLayout } from './layouts/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='dashboard' element={<DashboardPage />} />
            {/* Maker only routes */}
            <Route element={<ProtectedRoute allowedRoles={['MAKER']} />}>
              <Route path="/registry/new" element={
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">New Registration</h2>
                  <p className="text-sm text-slate-500 mt-1">Laf Registration Form...</p>
                </div>
              }
              />
              <Route path="/iterations/request" element={
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">Request Iteration</h2>
                  <p className="text-sm text-slate-500 mt-1">Maker Iteration Request Form...</p>
                </div>
              }
              />
            </Route>

            {/* checker only routes */}
            <Route element={<ProtectedRoute allowedRoles={['CHECKER']} />}>
              <Route path="/iterations/pending"
                element={
                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Pending Approvals</h2>
                    <p className="text-sm text-slate-500 mt-1">Checker Queue ...</p>
                  </div>
                }
              />
            </Route>
            {/* shared records and reports */}
            <Route path="/registry/search" element={
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Registry Search</h2>
                <p className="text-sm text-slate-500 mt-1">Search & Inquiries...</p>
              </div>
            }
            />
            <Route
              path="/reports"
              element={
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">Reports</h2>
                  <p className="text-sm text-slate-500 mt-1">Report Generation...</p>
                </div>
              }
            />
            {/* admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/audit-trail" element={
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">Audit Trail</h2>
                  <p className="text-sm text-slate-500 mt-1">System Audit Logs</p>
                </div>
              }
              />
              <Route path="/config" element={
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">System Configuration</h2>
                  <p className="text-sm text-slate-500 mt-1">System Config Parameters</p>
                </div>
              }
              />
            </Route>
          </Route>
        </Route>

        {/* fallbacks */}
        <Route path="/" element={<Navigate to={"/dashboard"} replace />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter >
  )
}

export default App
