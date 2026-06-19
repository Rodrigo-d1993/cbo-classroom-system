import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const ROLE_MODULES = {
  ADMIN_SISTEMA: [
    { label: 'Estudiantes', path: '/students' },
    { label: 'Cursos', path: '/courses' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
    { label: 'Usuarios', path: '/admin/users' },
    { label: 'Reportes', path: '/reports' },
  ],
  DIRECTOR: [
    { label: 'Estudiantes', path: '/students' },
    { label: 'Cursos', path: '/courses' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Reportes', path: '/reports' },
  ],
  DOCENTE: [
    { label: 'Mis cursos', path: '/courses' },
    { label: 'Calificaciones', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
  ],
  INSPECTOR: [
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Convivencia', path: '/annotations' },
    { label: 'Cursos', path: '/courses' },
  ],
  APODERADO: [
    { label: 'Notas', path: '/grades' },
    { label: 'Asistencia', path: '/attendance' },
    { label: 'Anotaciones', path: '/annotations' },
  ],
}

const STAT_THEMES = [
  {
    bg: '#FFFFFF',
    border: '#D9E2EC',
    label: '#52606D',
    value: '#102A43',
    accent: '#2F80ED',
  },
  {
    bg: '#FFFFFF',
    border: '#D9E2EC',
    label: '#52606D',
    value: '#102A43',
    accent: '#27AE60',
  },
  {
    bg: '#FFFFFF',
    border: '#D9E2EC',
    label: '#52606D',
    value: '#102A43',
    accent: '#F2994A',
  },
  {
    bg: '#FFFFFF',
    border: '#D9E2EC',
    label: '#52606D',
    value: '#102A43',
    accent: '#9B51E0',
  },
  {
    bg: '#FFFFFF',
    border: '#D9E2EC',
    label: '#52606D',
    value: '#102A43',
    accent: '#EB5757',
  },
]

function StatCard({ title, value, text, theme }) {
  return (
    <div
      className="rounded-xl p-4 border shadow-sm"
      style={{
        backgroundColor: theme.bg,
        borderColor: theme.border,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-wide"
        style={{ color: theme.label }}
      >
        {title}
      </p>

      <h2
        className="text-2xl font-semibold mt-1"
        style={{ color: theme.value }}
      >
        {value}
      </h2>

      <p
        className="text-xs mt-1"
        style={{ color: theme.accent }}
      >
        {text}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { title: 'Estudiantes', value: '560', text: 'Matrícula actual' },
    { title: 'Cursos', value: '18', text: 'Activos' },
    { title: 'Docentes', value: '42', text: 'Registrados' },
    { title: 'Asistencia', value: '94%', text: 'Promedio' },
    { title: 'Promedio', value: '5.8', text: 'General' },
  ]

  return (
<<<<<<< Updated upstream
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
=======
    <div className="min-h-screen bg-[#F4F7FA] text-[#1A2B3C] flex">
      <Navbar />

      <main className="flex-1 p-6 overflow-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0F2744] to-[#1E4976] rounded-2xl p-6 shadow-md">
          <h1 className="text-xl font-semibold text-white">
            Libro de Clases Digital
          </h1>

          <p className="text-xs text-[#C7D6E5] mt-1">
            Colegio Bernardo O'Higgins — Panel general del establecimiento
          </p>
        </div>

        {/* ESTADISTICAS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
          {stats.map((s, i) => (
            <StatCard
              key={s.title}
              {...s}
              theme={STAT_THEMES[i % STAT_THEMES.length]}
            />
>>>>>>> Stashed changes
          ))}
        </div>

        <div className="grid grid-cols-12 gap-5 mt-5">

          {/* MODULOS */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-[#D9E2EC] rounded-2xl p-5 shadow-sm">

            <h2 className="text-xs uppercase tracking-wide text-[#486581] mb-5">
              Módulos del libro
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              {(ROLE_MODULES[role] || []).map(item => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="bg-white border border-[#D9E2EC] rounded-xl p-4 cursor-pointer hover:border-[#2F80ED] hover:shadow-md transition-all"
                >
                  <h3 className="text-sm font-medium text-[#102A43]">
                    {item.label}
                  </h3>

                  <p className="text-xs text-[#2F80ED] mt-2">
                    Ingresar →
                  </p>
                </div>
              ))}

            </div>
          </div>

          {/* ALERTAS */}
          <div className="col-span-12 lg:col-span-4 bg-[#FFF8E6] border border-[#F2C94C] rounded-2xl p-5 shadow-sm">

            <h2 className="text-xs uppercase text-[#B7791F] mb-4">
              Alertas generales
            </h2>

            <div className="space-y-4 text-xs text-[#744210]">
              <p>⚠ 15 estudiantes bajo 85% asistencia</p>
              <p>⚠ 8 calificaciones pendientes</p>
              <p>⚠ 4 anotaciones sin revisar</p>

              <p className="text-[#2F855A]">
                ✓ Sistema actualizado hoy
              </p>
            </div>

          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white border border-[#D9E2EC] rounded-2xl p-5 mt-5 shadow-sm">

          <h2 className="text-xs uppercase text-[#486581] mb-5">
            Resumen académico institucional
          </h2>

          <div className="overflow-auto">

            <table className="w-full text-xs">

              <thead>
                <tr className="text-[#486581] border-b border-[#D9E2EC] bg-[#F4F7FA]">
                  <th className="text-left p-3">Nivel</th>
                  <th className="text-left p-3">Estudiantes</th>
                  <th className="text-left p-3">Asistencia</th>
                  <th className="text-left p-3">Promedio</th>
                </tr>
              </thead>

              <tbody className="text-[#243B53]">

                <tr className="border-b border-[#E6EDF5]">
                  <td className="p-3">1° Medio</td>
                  <td>150</td>
                  <td>93%</td>
                  <td>5.9</td>
                </tr>

                <tr className="border-b border-[#E6EDF5]">
                  <td className="p-3">2° Medio</td>
                  <td>140</td>
                  <td>95%</td>
                  <td>5.7</td>
                </tr>

                <tr className="border-b border-[#E6EDF5]">
                  <td className="p-3">3° Medio</td>
                  <td>135</td>
                  <td>92%</td>
                  <td>6.0</td>
                </tr>

                <tr>
                  <td className="p-3">4° Medio</td>
                  <td>135</td>
                  <td>94%</td>
                  <td>5.8</td>
                </tr>

              </tbody>

            </table>

          </div>
        </div>

        {/* ACTIVIDAD Y CALENDARIO */}
        <div className="grid grid-cols-12 gap-5 mt-5">

          <div className="col-span-12 lg:col-span-7 bg-white border border-[#D9E2EC] rounded-2xl p-5 shadow-sm">

            <h2 className="text-xs uppercase text-[#2F855A] mb-4">
              Actividad reciente
            </h2>

            <div className="space-y-4 text-xs text-[#243B53]">

              <p>
                ✓ Profesor registró asistencia
                <span className="text-[#2F855A] block">
                  Hace 5 minutos
                </span>
              </p>

              <p>
                ✓ Nuevas calificaciones ingresadas
                <span className="text-[#2F855A] block">
                  Hace 20 minutos
                </span>
              </p>

              <p>
                ✓ Inspector agregó observación
                <span className="text-[#2F855A] block">
                  Hace 1 hora
                </span>
              </p>

            </div>

          </div>

          <div className="col-span-12 lg:col-span-5 bg-white border border-[#D9E2EC] rounded-2xl p-5 shadow-sm">

            <h2 className="text-xs uppercase text-[#4C51BF] mb-4">
              Calendario escolar
            </h2>

            <div className="space-y-4 text-xs text-[#243B53]">
              <p>📅 Consejo de profesores</p>
              <p>📅 Reunión apoderados</p>
              <p>📅 Cierre de notas</p>
            </div>

          </div>

        </div>

      </main>
    </div>
  )
}