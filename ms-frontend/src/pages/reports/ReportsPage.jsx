import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// ─── Data ─────────────────────────────────────────────────────────────────────

const CURSOS = [
  '1° Medio A','1° Medio B','2° Medio A','2° Medio B',
  '3° Medio A','3° Medio B','4° Medio A','4° Medio B',
]

const TIPOS_REPORTE = [
  'Rendimiento Académico',
  'Asistencia',
  'Conducta',
  'Reunión de Apoderados',
  'Consejo de Profesores',
  'Visita Inspectoría',
  'Derivación PIE',
  'Entrevista Alumno',
  'Entrevista Apoderado',
  'Otro',
]

const ESTADOS_REPORTE = ['Borrador', 'Publicado', 'Archivado']

const MOCK_REPORTS = [
  {
    id: 1,
    titulo: 'Rendimiento primer semestre 1° Medio A',
    tipo: 'Rendimiento Académico',
    curso: '1° Medio A',
    fecha: '2024-06-28',
    estado: 'Publicado',
    descripcion: 'Resumen de notas y promedios del primer semestre. El curso presenta un promedio general de 5.4, con mejoras notables en Lenguaje y dificultades persistentes en Matemática.',
    creadoPor: 'Prof. Ramírez',
    adjuntos: 2,
  },
  {
    id: 2,
    titulo: 'Control de asistencia mayo — 2° Medio B',
    tipo: 'Asistencia',
    curso: '2° Medio B',
    fecha: '2024-05-31',
    estado: 'Publicado',
    descripcion: 'Registro de asistencia mensual. 3 alumnos presentan asistencia inferior al 85%, se procede a notificar a apoderados.',
    creadoPor: 'Prof. Soto',
    adjuntos: 0,
  },
  {
    id: 3,
    titulo: 'Reunión apoderados 3° Medio A — Junio',
    tipo: 'Reunión de Apoderados',
    curso: '3° Medio A',
    fecha: '2024-06-10',
    estado: 'Archivado',
    descripcion: 'Acta de reunión de apoderados del mes de junio. Asistencia: 18 de 28 apoderados.',
    creadoPor: 'Prof. Gutiérrez',
    adjuntos: 1,
  },
  {
    id: 4,
    titulo: 'Derivación PIE — Alumnos 4° Medio B',
    tipo: 'Derivación PIE',
    curso: '4° Medio B',
    fecha: '2024-04-15',
    estado: 'Borrador',
    descripcion: 'Listado de alumnos derivados al Programa de Integración Escolar para apoyo diferenciado en el segundo semestre.',
    creadoPor: 'Prof. Vidal',
    adjuntos: 3,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtFecha(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const ESTADO_STYLES = {
  Publicado:  'bg-green-500/15 text-green-400 border border-green-500/20',
  Borrador:   'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  Archivado:  'bg-gray-500/15 text-gray-400 border border-gray-500/20',
}

const TIPO_ICONS = {
  'Rendimiento Académico':    '📊',
  'Asistencia':               '📅',
  'Conducta':                 '⚠️',
  'Reunión de Apoderados':    '👨‍👩‍👧',
  'Consejo de Profesores':    '🏫',
  'Visita Inspectoría':       '🔍',
  'Derivación PIE':           '♿',
  'Entrevista Alumno':        '🎓',
  'Entrevista Apoderado':     '📞',
  'Otro':                     '📄',
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-white mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', options, required, span }) {
  const cls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
  return (
    <div className={span ? 'col-span-2' : ''}>
      <label className="block text-xs text-gray-400 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {options ? (
        <select className={cls} value={value} onChange={e => onChange(e.target.value)}>
          <option value="">Seleccionar...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea className={`${cls} h-28 resize-none`} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type} className={cls} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col w-full max-w-2xl max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  )
}

function ModalReporte({ initial, onSave, onClose }) {
  const blank = { titulo: '', tipo: '', curso: '', fecha: '', estado: 'Borrador', descripcion: '', creadoPor: '', adjuntos: 0 }
  const [form, setForm] = useState(initial ?? blank)
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const isEdit = !!initial

  const valid = form.titulo && form.tipo && form.curso && form.fecha

  return (
    <Modal title={isEdit ? 'Editar Reporte' : 'Nuevo Reporte'} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" value={form.titulo} onChange={set('titulo')} required span />
        <Field label="Tipo de reporte" value={form.tipo} onChange={set('tipo')} options={TIPOS_REPORTE} required />
        <Field label="Curso" value={form.curso} onChange={set('curso')} options={CURSOS} required />
        <Field label="Fecha" value={form.fecha} onChange={set('fecha')} type="date" required />
        <Field label="Estado" value={form.estado} onChange={set('estado')} options={ESTADOS_REPORTE} />
        <Field label="Creado por" value={form.creadoPor} onChange={set('creadoPor')} />
        <Field label="Descripción / Observaciones" value={form.descripcion} onChange={set('descripcion')} type="textarea" span />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
        <button
          disabled={!valid}
          onClick={() => { onSave({ ...form, id: initial?.id ?? Date.now() }); onClose() }}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isEdit ? 'Guardar cambios' : 'Crear reporte'}
        </button>
      </div>
    </Modal>
  )
}

function ModalVer({ report, onClose }) {
  return (
    <Modal title="Detalle del reporte" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{TIPO_ICONS[report.tipo] ?? '📄'}</span>
          <div>
            <h3 className="font-semibold text-white text-base leading-tight">{report.titulo}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{report.tipo} · {report.curso}</p>
          </div>
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[report.estado]}`}>{report.estado}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-800/60 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-0.5">Fecha</p>
            <p className="text-white">{fmtFecha(report.fecha)}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-0.5">Creado por</p>
            <p className="text-white">{report.creadoPor || '—'}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-0.5">Adjuntos</p>
            <p className="text-white">{report.adjuntos > 0 ? `${report.adjuntos} archivo${report.adjuntos !== 1 ? 's' : ''}` : 'Sin adjuntos'}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-0.5">Curso</p>
            <p className="text-white">{report.curso}</p>
          </div>
        </div>
        {report.descripcion && (
          <div className="bg-gray-800/60 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Descripción / Observaciones</p>
            <p className="text-sm text-gray-200 leading-relaxed">{report.descripcion}</p>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cerrar</button>
      </div>
    </Modal>
  )
}

// ─── Action Menu ─────────────────────────────────────────────────────────────

function ActionMenu({ onVer, onEditar, onArchivar, onEliminar }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = React.useRef(null)
  const items = [
    { label: '👁️ Ver detalle',  action: onVer },
    { label: '✏️ Editar',       action: onEditar },
    { label: '🗄️ Archivar',    action: onArchivar },
    { label: '🗑️ Eliminar',    action: onEliminar, danger: true },
  ]

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const menuH = items.length * 40
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < menuH + 8 ? rect.top - menuH - 4 : rect.bottom + 4
      const left = Math.max(8, rect.right - 176)
      setPos({ top, left })
    }
    setOpen(o => !o)
  }

  return (
    <div className="inline-block">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
      >
        Acciones
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-[998]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[999] w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            {items.map(({ label, action, danger }) => (
              <button
                key={label}
                onClick={() => { action(); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [modal, setModal] = useState(null) // { type: 'nuevo'|'editar'|'ver', report? }

  // Filters
  const [filtroCurso, setFiltroCurso] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const filtered = reports.filter(r => {
    if (filtroCurso && r.curso !== filtroCurso) return false
    if (filtroTipo && r.tipo !== filtroTipo) return false
    if (filtroEstado && r.estado !== filtroEstado) return false
    if (busqueda && !r.titulo.toLowerCase().includes(busqueda.toLowerCase()) && !r.descripcion.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  const saveReport = updated => setReports(rs => rs.some(r => r.id === updated.id) ? rs.map(r => r.id === updated.id ? updated : r) : [...rs, updated])
  const archivar = r => setReports(rs => rs.map(x => x.id === r.id ? { ...x, estado: 'Archivado' } : x))
  const eliminar = id => setReports(rs => rs.filter(r => r.id !== id))

  // Stats
  const totalPublicados = reports.filter(r => r.estado === 'Publicado').length
  const totalBorradores = reports.filter(r => r.estado === 'Borrador').length
  const totalArchivados = reports.filter(r => r.estado === 'Archivado').length

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Reportes</h1>
            <p className="text-xs text-gray-500 mt-0.5">Libro de clases — gestión de reportes del establecimiento</p>
          </div>
          <button
            onClick={() => setModal({ type: 'nuevo' })}
            className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Nuevo reporte
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total reportes" value={reports.length} color="text-white" />
          <StatCard label="Publicados" value={totalPublicados} color="text-green-400" />
          <StatCard label="Borradores" value={totalBorradores} color="text-yellow-400" />
          <StatCard label="Archivados" value={totalArchivados} color="text-gray-400" />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <input
            className="col-span-2 sm:col-span-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="Buscar reporte..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            value={filtroCurso}
            onChange={e => setFiltroCurso(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {CURSOS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {TIPOS_REPORTE.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS_REPORTE.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="text-left px-5 py-3">Título</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Tipo</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Curso</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Fecha</th>
                <th className="text-left px-5 py-3">Estado</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Creado por</th>
                <th className="text-left px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">
                    No se encontraron reportes.{' '}
                    <button onClick={() => setModal({ type: 'nuevo' })} className="text-blue-400 hover:underline">Crear el primero</button>
                  </td>
                </tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{TIPO_ICONS[r.tipo] ?? '📄'}</span>
                      <span className="font-medium text-white leading-tight line-clamp-1">{r.titulo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400 hidden sm:table-cell whitespace-nowrap">{r.tipo}</td>
                  <td className="px-5 py-3 text-gray-300 hidden md:table-cell whitespace-nowrap">{r.curso}</td>
                  <td className="px-5 py-3 text-gray-400 hidden md:table-cell whitespace-nowrap">{fmtFecha(r.fecha)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${ESTADO_STYLES[r.estado]}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{r.creadoPor || '—'}</td>
                  <td className="px-5 py-3">
                    <ActionMenu
                      onVer={() => setModal({ type: 'ver', report: r })}
                      onEditar={() => setModal({ type: 'editar', report: r })}
                      onArchivar={() => archivar(r)}
                      onEliminar={() => eliminar(r.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-3">{filtered.length} reporte{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
      </main>

      <Footer />

      {/* Modals */}
      {modal?.type === 'nuevo' && (
        <ModalReporte onSave={saveReport} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editar' && (
        <ModalReporte initial={modal.report} onSave={saveReport} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'ver' && (
        <ModalVer report={modal.report} onClose={() => setModal(null)} />
      )}
    </div>
  )
}