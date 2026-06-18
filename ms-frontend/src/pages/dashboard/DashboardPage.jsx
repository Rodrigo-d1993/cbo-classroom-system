import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const ROLE_LABELS = {
  ADMIN_SISTEMA: 'Administrador del Sistema',
  DIRECTOR:      'Director',
  DOCENTE:       'Docente',
  INSPECTOR:     'Inspector',
  APODERADO:     'Apoderado',
}

const ROLE_MODULES = {
  ADMIN_SISTEMA: [
    { label: 'Estudiantes',    path: '/students' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia',     path: '/attendance' },
    { label: 'Anotaciones',    path: '/annotations' },
    { label: 'Usuarios',       path: '/admin/users' },
    { label: 'Reportes',       path: '/reports' },
  ],
  DIRECTOR: [
    { label: 'Estudiantes',    path: '/students' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia',     path: '/attendance' },
    { label: 'Anotaciones',    path: '/annotations' },
    { label: 'Reportes',       path: '/reports' },
  ],
  DOCENTE: [
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia',     path: '/attendance' },
    { label: 'Anotaciones',    path: '/annotations' },
  ],
  INSPECTOR: [
    { label: 'Asistencia',     path: '/attendance' },
    { label: 'Anotaciones',    path: '/annotations' },
  ],
  APODERADO: [
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia',     path: '/attendance' },
    { label: 'Anotaciones',    path: '/annotations' },
  ],
}

export default function DashboardPage() {
  const { role } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Bienvenido</h1>
        <p className="text-gray-400 text-sm mb-8">
          Accediste como <span className="text-blue-400">{ROLE_LABELS[role] || role}</span>. Estos son los módulos disponibles para tu rol.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(ROLE_MODULES[role] || []).map(modulo => (
            <div
              key={modulo.path}
              onClick={() => navigate(modulo.path)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <p className="font-medium text-sm">{modulo.label}</p>
              <p className="text-gray-500 text-xs mt-1">Ver módulo →</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}