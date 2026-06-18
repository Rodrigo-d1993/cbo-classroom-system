import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_LABELS = {
  ADMIN_SISTEMA: 'Administrador del Sistema',
  DIRECTOR:      'Director',
  DOCENTE:       'Docente',
  INSPECTOR:     'Inspector',
  APODERADO:     'Apoderado',
}

const NAV_LINKS = {
  ADMIN_SISTEMA: [
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Estudiantes',   path: '/students' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
    { label: 'Usuarios',      path: '/admin/users' },
    { label: 'Reportes',      path: '/reports' },
  ],
  DIRECTOR: [
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Estudiantes',   path: '/students' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
    { label: 'Reportes',      path: '/reports' },
  ],
  DOCENTE: [
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
  ],
  INSPECTOR: [
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
  ],
  APODERADO: [
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
  ],
}

export default function Navbar() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = NAV_LINKS[role] || []

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      {/* Barra superior */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
            CBO
          </div>
          <span className="font-semibold text-white text-sm">Libro de Clases Digital</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{ROLE_LABELS[role] || role}</span>
          <button
            onClick={logout}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Links de navegación */}
      <nav className="px-6 flex gap-1 overflow-x-auto">
        {links.map(link => {
          const active = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-xs px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}