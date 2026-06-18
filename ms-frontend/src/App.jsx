import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

import LoginPage        from './pages/auth/LoginPage'
import DashboardPage    from './pages/dashboard/DashboardPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import StudentsPage     from './pages/students/StudentsPage'
import GradesPage       from './pages/grades/GradesPage'
import AttendancePage   from './pages/attendance/AttendancePage'
import AnnotationsPage  from './pages/annotations/AnnotationsPage'
import AdminUsersPage   from './pages/admin/AdminUsersPage'
import ReportsPage      from './pages/reports/ReportsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Pública */}
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Cualquier rol autenticado */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/grades"    element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
          <Route path="/annotations" element={<ProtectedRoute><AnnotationsPage /></ProtectedRoute>} />

          {/* Solo ADMIN, DIRECTOR */}
          <Route path="/students" element={
            <ProtectedRoute allowedRoles={['ADMIN_SISTEMA', 'DIRECTOR']}>
              <StudentsPage />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['ADMIN_SISTEMA', 'DIRECTOR']}>
              <ReportsPage />
            </ProtectedRoute>
          } />

          {/* Solo ADMIN */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN_SISTEMA']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          {/* Raíz */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}