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
    <div style={{ backgroundColor: '#111f3e' }} className="min-h-screen text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Bienvenido</h1>
        <p style={{ color: '#87c8e8' }} className="text-sm mb-8">
          Accediste como{' '}
          <span style={{ color: '#0efff9' }}>{ROLE_LABELS[role] || role}</span>.
          Estos son los módulos disponibles para tu rol.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(ROLE_MODULES[role] || []).map(modulo => (
            <div
              key={modulo.path}
              onClick={() => navigate(modulo.path)}
              style={{
                backgroundColor: '#0d4977',
                border: '1px solid #087cb9',
              }}
              className="rounded-xl p-5 cursor-pointer transition-all hover:border-[#03c2fe]"
            >
              <p className="font-medium text-sm text-white">{modulo.label}</p>
              <p style={{ color: '#03c2fe' }} className="text-xs mt-1">Ver módulo →</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}