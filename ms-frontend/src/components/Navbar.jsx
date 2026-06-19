import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_LABELS = {
  ADMIN_SISTEMA: 'Administrador del Sistema',
  DIRECTOR: 'Director',
  DOCENTE: 'Docente',
  INSPECTOR: 'Inspector',
  APODERADO: 'Apoderado',
}

const NAV_LINKS = {
  ADMIN_SISTEMA: [
<<<<<<< Updated upstream
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Estudiantes',   path: '/students' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
    { label: 'Usuarios',      path: '/admin/users' },
    { label: 'Reportes',      path: '/reports' },
=======
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Estudiantes', path: '/students' },
    { label: 'Cursos', path: '/courses' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
    { label: 'Usuarios', path: '/admin/users' },
    { label: 'Reportes', path: '/reports' },
>>>>>>> Stashed changes
  ],

  DIRECTOR: [
<<<<<<< Updated upstream
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Estudiantes',   path: '/students' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
    { label: 'Reportes',      path: '/reports' },
=======
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Estudiantes', path: '/students' },
    { label: 'Cursos', path: '/courses' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
    { label: 'Reportes', path: '/reports' },
>>>>>>> Stashed changes
  ],

  DOCENTE: [
<<<<<<< Updated upstream
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
=======
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Cursos', path: '/courses' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
>>>>>>> Stashed changes
  ],

  INSPECTOR: [
<<<<<<< Updated upstream
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
=======
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
>>>>>>> Stashed changes
  ],

  APODERADO: [
<<<<<<< Updated upstream
    { label: 'Inicio',        path: '/dashboard' },
    { label: 'Calificaciones',path: '/grades' },
    { label: 'Asistencia',    path: '/attendance' },
    { label: 'Anotaciones',   path: '/annotations' },
=======
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
>>>>>>> Stashed changes
  ],
}

export default function Navbar() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = NAV_LINKS[role] || []

  return (
<<<<<<< Updated upstream
    <header className="bg-gray-900 border-b border-gray-800">
      {/* Barra superior */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
            CBO
=======
    <aside className="w-64 min-h-screen bg-[#0A1A35] border-r border-[#16294D] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#16294D]">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#1C5E9C] to-[#0E2F57] flex items-center justify-center text-[#5FD4FF] font-bold text-sm">
            LCD
          </div>

          <div>
            <h2 className="text-base font-semibold text-white leading-tight">
              Libro de Clases
            </h2>

            <p className="text-[#5F8AC2] text-[11px]">
              CBO Digital
            </p>
>>>>>>> Stashed changes
          </div>
        </div>
<<<<<<< Updated upstream
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
=======

        <div className="mt-4 inline-flex items-center border border-[#1C5E9C] rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mr-2" />
          <span className="text-[10px] text-[#9DC6EC] tracking-wide">
            {ROLE_LABELS[role] || role}
          </span>
        </div>
      </div>

      {/* Navegación */}
      <div className="px-3 py-5 flex-1">
        <p className="text-[10px] tracking-widest text-[#4D6A99] mb-3 px-1">
          NAVEGACIÓN
        </p>

        <div className="space-y-1">
          {links.map(link => {
            const active = location.pathname === link.path

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`
                  w-full
                  text-left
                  px-3
                  py-2
                  rounded-lg
                  text-[13px]
                  transition-all
                  ${
                    active
                      ? 'bg-[#16407A] text-white font-medium'
                      : 'text-[#8FB6E0] hover:bg-[#0F2748] hover:text-white'
                  }
                `}
              >
                {link.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cerrar sesión */}
      <div className="border-t border-[#16294D] p-4">
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-[#F87171] hover:bg-[#1A0E0E] transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
>>>>>>> Stashed changes
  )
}