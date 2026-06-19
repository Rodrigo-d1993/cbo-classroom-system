import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// ─── Data ────────────────────────────────────────────────────────────────────

const CURSOS_DATA = {
  "1° Medio A": [
    "Aguirre Soto Martín Ignacio","Bahamondes Reyes Camila Sofía","Cárcamo Vergara Joaquín Andrés",
    "Donoso Pizarro Florencia Antonia","Espinoza Ramírez Benjamín Tomás","Fuentealba Morales Isidora Belén",
    "Gajardo Tapia Matías Esteban","Henríquez Cortés Valentina Paz","Inostroza Bravo Sebastián Andrés",
    "Jara Contreras Constanza Javiera",
  ],
  "1° Medio B": [
    "Lagos Fernández Diego Alejandro","Maldonado Rojas Antonia Fernanda","Navarro Castillo Tomás Ignacio",
    "Olivares Sepúlveda Camila Andrea","Pinto Gallardo Maximiliano José","Quezada Muñoz Fernanda Isidora",
    "Reyes Sandoval Vicente Andrés","Saavedra Toro Javiera Belén","Tapia Riquelme Cristóbal Eduardo",
    "Urrutia Vásquez Martina Sofía",
  ],
  "2° Medio A": [
    "Alarcón Beltrán Felipe Andrés","Bustos Carvajal Daniela Paz","Contreras Lara Agustín Nicolás",
    "Díaz Cáceres Florencia Isabel","Escobar Pino Lucas Benjamín","Flores Vega Catalina Antonia",
    "González Araya Bastián Ignacio","Herrera Soto Valeria Constanza","Ibarra Muñoz Joaquín Esteban",
    "Jiménez Rivas Antonella Fernanda",
  ],
  "2° Medio B": [
    "Lara Quiroz Matías Alonso","Mella Figueroa Josefa Belén","Núñez Ortiz Sebastián Tomás",
    "Ortega Salazar Camila Constanza","Pérez Aguilar Vicente Maximiliano","Ramos Bahamonde Isidora Antonia",
    "Sepúlveda Lagos Cristóbal Andrés","Toledo Méndez Florencia Paz","Valdés Soto Benjamín Andrés",
    "Zúñiga Pacheco Valentina Sofía",
  ],
  "3° Medio A": [
    "Alcayaga Alcayaga Álvaro Andrés","Álvarez Fernández Maicol Exequiel","Campillay Bordones Claudio Alejandro",
    "Campillay Flores Tais Ariana","Campillay Olmos Jayson Maykol","Carmona Campillay Walter Bastián",
    "Fritis Muñoz Katryna Estefanía","Garvizo Santibáñez Fernanda Alejandra","Henríquez Bordones Ignacio Maximiliano",
    "Iturra Campillay Renata Belén",
  ],
  "3° Medio B": [
    "Bravo Sánchez Constanza Belén","Cortés Vidal Maximiliano Andrés","Espinoza Tapia Fernanda Javiera",
    "Lobos Araya Ignacio Tomás","Muñoz Cárdenas Valentina Paz","Reyes Bustos Joaquín Esteban",
    "Salinas Pizarro Camila Antonia","Torres Lagos Benjamín Andrés","Vergara Olmos Isidora Fernanda",
    "Yáñez Carrasco Martín Alonso",
  ],
  "4° Medio A": [
    "Araya Fuenzalida Tomás Vicente","Bórquez Lillo Antonia Valentina","Cisternas Pino Joaquín Andrés",
    "Duarte Sandoval Florencia Camila","Estay Morales Lucas Benjamín","Fernández Gallardo Catalina Sofía",
    "Guerrero Ríos Bastián Maximiliano","Hidalgo Vergara Javiera Constanza","Inzunza Toledo Cristóbal Ignacio",
    "Leiva Bahamondes Antonella Belén",
  ],
  "4° Medio B": [
    "Mancilla Quezada Sebastián Andrés","Navarrete Rojas Valentina Antonia","Ojeda Carvajal Matías Esteban",
    "Parra Espinoza Isidora Fernanda","Quiroz Tapia Benjamín Tomás","Rivas Contreras Camila Paz",
    "Soto Aguirre Agustín Nicolás","Tapia Bustos Florencia Andrea","Vásquez Lagos Vicente Maximiliano",
    "Zamora Pizarro Martina Josefa",
  ],
}

function generateRut(index) {
  const base = 20000000 + index * 111111
  const digits = String(base).split('').map(Number)
  const factors = [2,3,4,5,6,7,2,3]
  let sum = 0
  for (let i = digits.length - 1, f = 0; i >= 0; i--, f++) sum += digits[i] * factors[f % 8]
  const rem = 11 - (sum % 11)
  const dv = rem === 11 ? '0' : rem === 10 ? 'K' : String(rem)
  const fmt = base.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${fmt}-${dv}`
}

let globalId = 1
const ALL_STUDENTS = Object.entries(CURSOS_DATA).flatMap(([curso, names]) =>
  names.map((nombre, i) => ({
    id: globalId++,
    nombre,
    rut: generateRut(globalId),
    curso,
    estado: globalId % 7 === 0 ? 'Inactivo' : 'Activo',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    email: '',
    direccion: '',
    comuna: '',
    nacionalidad: 'Chilena',
    etnia: '',
    apoderado: {
      nombre: '', rut: '', telefono: '', email: '',
      vinculo: '', direccion: '', comuna: '', nivelEducacional: '',
    },
    notas: [
      { asignatura: 'Matemática',   n1: 5.5, n2: 6.0, n3: 4.8, n4: 6.2, promedio: 5.6 },
      { asignatura: 'Lenguaje',     n1: 6.1, n2: 5.7, n3: 6.3, n4: 5.9, promedio: 6.0 },
      { asignatura: 'Historia',     n1: 4.9, n2: 5.5, n3: 5.8, n4: 6.0, promedio: 5.6 },
      { asignatura: 'Ciencias',     n1: 5.0, n2: 5.2, n3: 6.1, n4: 5.8, promedio: 5.5 },
      { asignatura: 'Inglés',       n1: 6.5, n2: 6.0, n3: 6.3, n4: 6.8, promedio: 6.4 },
      { asignatura: 'Ed. Física',   n1: 6.8, n2: 7.0, n3: 6.9, n4: 7.0, promedio: 6.9 },
    ],
    asistencia: [
      { mes: 'Marzo',      dias: 22, presentes: 21, ausentes: 1,  porcentaje: 95.5 },
      { mes: 'Abril',      dias: 20, presentes: 18, ausentes: 2,  porcentaje: 90.0 },
      { mes: 'Mayo',       dias: 21, presentes: 20, ausentes: 1,  porcentaje: 95.2 },
      { mes: 'Junio',      dias: 18, presentes: 16, ausentes: 2,  porcentaje: 88.9 },
    ],
    anotaciones: [
      { tipo: 'ANOTACIÓN POSITIVA', detalle: 'Excelente participación en clases', fecha: '15/03/2024', creadoPor: 'Prof. Ramírez' },
      { tipo: 'ENTREVISTA CON EL ALUMNO', detalle: 'Orientación vocacional', fecha: '02/04/2024', creadoPor: 'Prof. Gutiérrez' },
      { tipo: 'ANOTACIÓN NEGATIVA', detalle: 'Falta de materiales', fecha: '10/05/2024', creadoPor: 'Prof. Soto' },
    ],
  }))
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TIPOS_ANOTACION = [
  'TODOS','ENTREVISTA CON EL ALUMNO','ENTREVISTA CON APODERADO','RECONOCIMIENTO',
  'DERIVACIÓN EXTERNA','FALTA','FALTA LEVE','FALTA GRAVE','FALTA GRAVÍSIMA',
  'ANOTACIÓN POSITIVA','ANOTACIÓN NEGATIVA','OTROS',
]

function Badge({ estado }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estado === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
      {estado}
    </span>
  )
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-800 mb-6">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${active === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={`bg-gray-900 border border-gray-800 rounded-2xl flex flex-col max-h-[90vh] ${wide ? 'w-full max-w-4xl' : 'w-full max-w-xl'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', options, required }) {
  const cls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {options ? (
        <select className={cls} value={value} onChange={e => onChange(e.target.value)}>
          <option value="">Seleccionar</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className={cls} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  )
}

// Ficha identificación
function FichaIdentificacion({ student, onSave, onClose }) {
  const [form, setForm] = useState({ ...student })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  return (
    <Modal title="Ficha de Identificación" onClose={onClose} wide>
      <p className="text-xs text-gray-400 mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="RUT" value={form.rut} onChange={set('rut')} required />
        <Field label="Apellido Paterno" value={form.nombre.split(' ')[0]} onChange={() => {}} required />
        <Field label="Apellido Materno" value={form.nombre.split(' ')[1] || ''} onChange={() => {}} required />
        <Field label="Nombres" value={form.nombre.split(' ').slice(2).join(' ')} onChange={() => {}} required />
        <Field label="Fecha Nacimiento" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} type="date" />
        <Field label="Género" value={form.genero} onChange={set('genero')} options={['MASCULINO','FEMENINO','OTRO']} />
        <Field label="Nacionalidad" value={form.nacionalidad} onChange={set('nacionalidad')} options={['Chilena','Argentina','Peruana','Venezolana','Colombiana','Otra']} />
        <Field label="Ciudad de Nacimiento" value={form.ciudad || ''} onChange={set('ciudad')} />
        <Field label="Dirección" value={form.direccion} onChange={set('direccion')} />
        <Field label="Comuna" value={form.comuna} onChange={set('comuna')} />
        <Field label="Etnia" value={form.etnia} onChange={set('etnia')} options={['','Mapuche','Aymara','Rapa Nui','Atacameño','Quechua','Otra']} />
        <Field label="Teléfono Celular" value={form.telefono} onChange={set('telefono')} />
        <Field label="Teléfono Fijo" value={form.telefonoFijo || ''} onChange={set('telefonoFijo')} />
        <Field label="E-Mail" value={form.email} onChange={set('email')} type="email" />
        <Field label="Nombre contacto Emergencia" value={form.contactoEmergencia || ''} onChange={set('contactoEmergencia')} />
        <Field label="Teléfono Emergencia" value={form.telefonoEmergencia || ''} onChange={set('telefonoEmergencia')} />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Volver</button>
        <button onClick={() => { onSave(form); onClose() }} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">Guardar</button>
      </div>
    </Modal>
  )
}

// Ficha apoderado
function FichaApoderado({ student, onSave, onClose }) {
  const [form, setForm] = useState({ ...student.apoderado })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  return (
    <Modal title="Antecedentes Familiares" onClose={onClose} wide>
      <p className="text-xs text-gray-400 mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <h3 className="text-sm font-semibold mb-4 text-gray-200">Ficha de Familiar / Apoderado</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Tipo Documento" value={form.tipoDoc || ''} onChange={set('tipoDoc')} options={['RUT','Pasaporte','DNI']} required />
        <Field label="Número de Documento" value={form.rut} onChange={set('rut')} required />
        <Field label="Apellido Paterno" value={form.apellidoPaterno || ''} onChange={set('apellidoPaterno')} required />
        <Field label="Apellido Materno" value={form.apellidoMaterno || ''} onChange={set('apellidoMaterno')} />
        <Field label="Nombres" value={form.nombre} onChange={set('nombre')} required />
        <Field label="Estado Civil" value={form.estadoCivil || ''} onChange={set('estadoCivil')} options={['Soltero/a','Casado/a','Divorciado/a','Viudo/a','Conviviente']} />
        <Field label="Vínculo Familiar" value={form.vinculo} onChange={set('vinculo')} options={['Padre','Madre','Tutor/a','Abuelo/a','Hermano/a','Otro']} required />
        <Field label="Tipo Apoderado" value={form.tipoApoderado || ''} onChange={set('tipoApoderado')} options={['Apoderado Titular','Apoderado Suplente']} required />
        <Field label="Edad" value={form.edad || ''} onChange={set('edad')} type="number" />
        <Field label="Dirección" value={form.direccion} onChange={set('direccion')} />
        <Field label="Comuna" value={form.comuna} onChange={set('comuna')} />
        <Field label="Email" value={form.email} onChange={set('email')} type="email" />
        <Field label="Teléfono Celular" value={form.telefono} onChange={set('telefono')} />
        <Field label="Teléfono Fijo" value={form.telefonoFijo || ''} onChange={set('telefonoFijo')} />
        <Field label="Nivel Educacional" value={form.nivelEducacional} onChange={set('nivelEducacional')} options={['Básica Incompleta','Básica Completa','Media Incompleta','Media Completa','Técnico Superior','Universitaria','Postgrado']} />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Volver</button>
        <button onClick={() => { onSave({ ...student, apoderado: form }); onClose() }} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">Guardar</button>
      </div>
    </Modal>
  )
}

// Notas
function FichaNotas({ student, onClose }) {
  return (
    <Modal title="Notas" onClose={onClose} wide>
      <p className="text-xs text-gray-400 mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="text-left py-2 pr-4">Asignatura</th>
              <th className="text-center py-2 px-3">N°1</th>
              <th className="text-center py-2 px-3">N°2</th>
              <th className="text-center py-2 px-3">N°3</th>
              <th className="text-center py-2 px-3">N°4</th>
              <th className="text-center py-2 px-3 font-semibold text-white">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {student.notas.map((n, i) => (
              <tr key={i} className="border-b border-gray-800/50">
                <td className="py-2 pr-4 font-medium">{n.asignatura}</td>
                {[n.n1, n.n2, n.n3, n.n4].map((v, j) => (
                  <td key={j} className="text-center py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${v >= 4 ? 'text-green-400' : 'text-red-400'}`}>{v.toFixed(1)}</span>
                  </td>
                ))}
                <td className="text-center py-2 px-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${n.promedio >= 5.5 ? 'bg-green-500/20 text-green-400' : n.promedio >= 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{n.promedio.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cerrar</button>
      </div>
    </Modal>
  )
}

// Asistencia
function FichaAsistencia({ student, onClose }) {
  const total = student.asistencia.reduce((a, m) => a + m.dias, 0)
  const presentes = student.asistencia.reduce((a, m) => a + m.presentes, 0)
  const pct = ((presentes / total) * 100).toFixed(1)
  return (
    <Modal title="Asistencia" onClose={onClose} wide>
      <p className="text-xs text-gray-400 mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{pct}%</p>
          <p className="text-xs text-gray-400 mt-1">Asistencia Global</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{presentes}</p>
          <p className="text-xs text-gray-400 mt-1">Días Presentes</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{total - presentes}</p>
          <p className="text-xs text-gray-400 mt-1">Días Ausentes</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="text-left py-2">Mes</th>
            <th className="text-center py-2">Días Hábiles</th>
            <th className="text-center py-2">Presentes</th>
            <th className="text-center py-2">Ausentes</th>
            <th className="text-center py-2">% Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {student.asistencia.map((m, i) => (
            <tr key={i} className="border-b border-gray-800/50">
              <td className="py-2 font-medium">{m.mes}</td>
              <td className="text-center py-2">{m.dias}</td>
              <td className="text-center py-2 text-green-400">{m.presentes}</td>
              <td className="text-center py-2 text-red-400">{m.ausentes}</td>
              <td className="text-center py-2">
                <span className={`px-2 py-0.5 rounded text-xs ${m.porcentaje >= 85 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{m.porcentaje}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cerrar</button>
      </div>
    </Modal>
  )
}

// Hoja de vida / anotaciones
function FichaHojaVida({ student, onSave, onClose }) {
  const [anotaciones, setAnotaciones] = useState([...student.anotaciones])
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [showForm, setShowForm] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [form, setForm] = useState({ tipo: '', detalle: '', fecha: '', creadoPor: '' })

  const filtered = filtroTipo === 'TODOS' ? anotaciones : anotaciones.filter(a => a.tipo === filtroTipo)

  const openNew = () => { setForm({ tipo: '', detalle: '', fecha: '', creadoPor: '' }); setEditIdx(null); setShowForm(true) }
  const openEdit = (i) => { setForm({ ...anotaciones[i] }); setEditIdx(i); setShowForm(true) }
  const saveForm = () => {
    if (editIdx !== null) {
      const copy = [...anotaciones]; copy[editIdx] = form; setAnotaciones(copy)
    } else {
      setAnotaciones(a => [...a, form])
    }
    setShowForm(false)
  }
  const deleteAnotacion = i => setAnotaciones(a => a.filter((_, idx) => idx !== i))

  return (
    <Modal title="Hoja de Vida" onClose={() => { onSave({ ...student, anotaciones }); onClose() }} wide>
      <p className="text-xs text-gray-400 mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      {showForm ? (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">{editIdx !== null ? 'Editar Antecedente' : 'Agregar Antecedente'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tipo Antecedente" value={form.tipo} onChange={v => setForm(f => ({...f, tipo: v}))} options={TIPOS_ANOTACION.slice(1)} required />
            <Field label="Fecha" value={form.fecha} onChange={v => setForm(f => ({...f, fecha: v}))} type="date" />
            <Field label="Creado por" value={form.creadoPor} onChange={v => setForm(f => ({...f, creadoPor: v}))} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Detalle</label>
            <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 h-24 resize-none" value={form.detalle} onChange={e => setForm(f => ({...f, detalle: e.target.value}))} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
            <button onClick={saveForm} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg">Guardar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              {TIPOS_ANOTACION.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="ml-auto">
              <button onClick={openNew} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">+ Agregar Antecedente</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left py-2 pr-3">Tipo Antecedente</th>
                  <th className="text-left py-2 pr-3">Detalle</th>
                  <th className="text-left py-2 pr-3">Fecha</th>
                  <th className="text-left py-2 pr-3">Creado por</th>
                  <th className="text-left py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${a.tipo.includes('POSITIVA') || a.tipo.includes('RECONOC') ? 'bg-green-500/20 text-green-400' : a.tipo.includes('NEGATIVA') || a.tipo.includes('FALTA') ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{a.tipo}</span>
                    </td>
                    <td className="py-2 pr-3 text-gray-300 max-w-[180px] truncate">{a.detalle}</td>
                    <td className="py-2 pr-3 text-gray-400 whitespace-nowrap">{a.fecha}</td>
                    <td className="py-2 pr-3 text-gray-400">{a.creadoPor}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(anotaciones.indexOf(a))} className="w-7 h-7 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg flex items-center justify-center text-xs transition-colors">✏️</button>
                        <button onClick={() => deleteAnotacion(anotaciones.indexOf(a))} className="w-7 h-7 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg flex items-center justify-center text-xs transition-colors">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-sm">Sin antecedentes registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => { onSave({ ...student, anotaciones }); onClose() }} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cerrar</button>
          </div>
        </>
      )}
    </Modal>
  )
}

// Agregar estudiante
function ModalAgregar({ cursos, onSave, onClose }) {
  const [form, setForm] = useState({ nombre: '', rut: '', curso: cursos[0] || '', estado: 'Activo', email: '', telefono: '', fechaNacimiento: '', genero: '', direccion: '', comuna: '', nacionalidad: 'Chilena', etnia: '' })
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  return (
    <Modal title="Agregar Estudiante" onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Nombres completos" value={form.nombre} onChange={set('nombre')} required />
        <Field label="RUT (sin puntos ni guión)" value={form.rut} onChange={set('rut')} required />
        <Field label="Curso" value={form.curso} onChange={set('curso')} options={cursos} required />
        <Field label="Fecha Nacimiento" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} type="date" />
        <Field label="Género" value={form.genero} onChange={set('genero')} options={['MASCULINO','FEMENINO','OTRO']} />
        <Field label="Estado" value={form.estado} onChange={set('estado')} options={['Activo','Inactivo']} />
        <Field label="Teléfono Celular" value={form.telefono} onChange={set('telefono')} />
        <Field label="E-Mail" value={form.email} onChange={set('email')} type="email" />
        <Field label="Dirección" value={form.direccion} onChange={set('direccion')} />
        <Field label="Comuna" value={form.comuna} onChange={set('comuna')} />
        <Field label="Nacionalidad" value={form.nacionalidad} onChange={set('nacionalidad')} options={['Chilena','Argentina','Peruana','Venezolana','Colombiana','Otra']} />
        <Field label="Etnia" value={form.etnia} onChange={set('etnia')} options={['','Mapuche','Aymara','Rapa Nui','Atacameño','Quechua','Otra']} />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
        <button
          onClick={() => {
            if (!form.nombre || !form.rut || !form.curso) return
            onSave({ ...form, id: Date.now(), apoderado: { nombre:'',rut:'',telefono:'',email:'',vinculo:'',direccion:'',comuna:'',nivelEducacional:'' }, notas: [], asistencia: [], anotaciones: [] })
            onClose()
          }}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          Guardar
        </button>
      </div>
    </Modal>
  )
}

// Vista completa (tabs)
function FichaCompleta({ student, onSave, onClose }) {
  const TABS = ['Identificación','Apoderado','Notas','Asistencia','Hoja de Vida']
  const [tab, setTab] = useState('Identificación')
  const [s, setS] = useState({ ...student })
  const save = updated => setS(updated)
  return (
    <Modal title={`Ficha: ${student.nombre}`} onClose={() => { onSave(s); onClose() }} wide>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'Identificación' && <FichaIdentificacionInline student={s} onSave={save} />}
      {tab === 'Apoderado' && <FichaApoderadoInline student={s} onSave={save} />}
      {tab === 'Notas' && <NotasInline student={s} />}
      {tab === 'Asistencia' && <AsistenciaInline student={s} />}
      {tab === 'Hoja de Vida' && <HojaVidaInline student={s} onSave={save} />}
      <div className="flex justify-end mt-4 pt-4 border-t border-gray-800">
        <button onClick={() => { onSave(s); onClose() }} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg">Cerrar y Guardar</button>
      </div>
    </Modal>
  )
}

function FichaIdentificacionInline({ student, onSave }) {
  const [form, setForm] = useState({ ...student })
  const set = k => v => { const f = { ...form, [k]: v }; setForm(f); onSave(f) }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="RUT" value={form.rut} onChange={set('rut')} required />
      <Field label="Nombre completo" value={form.nombre} onChange={set('nombre')} required />
      <Field label="Curso" value={form.curso} onChange={set('curso')} options={Object.keys(CURSOS_DATA)} required />
      <Field label="Fecha Nacimiento" value={form.fechaNacimiento || ''} onChange={set('fechaNacimiento')} type="date" />
      <Field label="Género" value={form.genero || ''} onChange={set('genero')} options={['MASCULINO','FEMENINO','OTRO']} />
      <Field label="Estado" value={form.estado} onChange={set('estado')} options={['Activo','Inactivo']} />
      <Field label="Teléfono" value={form.telefono || ''} onChange={set('telefono')} />
      <Field label="Email" value={form.email || ''} onChange={set('email')} type="email" />
      <Field label="Dirección" value={form.direccion || ''} onChange={set('direccion')} />
      <Field label="Comuna" value={form.comuna || ''} onChange={set('comuna')} />
      <Field label="Nacionalidad" value={form.nacionalidad || ''} onChange={set('nacionalidad')} options={['Chilena','Argentina','Peruana','Venezolana','Colombiana','Otra']} />
      <Field label="Etnia" value={form.etnia || ''} onChange={set('etnia')} options={['','Mapuche','Aymara','Rapa Nui','Atacameño','Quechua','Otra']} />
    </div>
  )
}

function FichaApoderadoInline({ student, onSave }) {
  const [form, setForm] = useState({ ...student.apoderado })
  const set = k => v => { const f = { ...form, [k]: v }; setForm(f); onSave({ ...student, apoderado: f }) }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="Nombres" value={form.nombre} onChange={set('nombre')} required />
      <Field label="RUT" value={form.rut} onChange={set('rut')} />
      <Field label="Vínculo" value={form.vinculo} onChange={set('vinculo')} options={['Padre','Madre','Tutor/a','Abuelo/a','Hermano/a','Otro']} required />
      <Field label="Tipo Apoderado" value={form.tipoApoderado || ''} onChange={set('tipoApoderado')} options={['Apoderado Titular','Apoderado Suplente']} />
      <Field label="Teléfono" value={form.telefono} onChange={set('telefono')} />
      <Field label="Email" value={form.email} onChange={set('email')} type="email" />
      <Field label="Dirección" value={form.direccion} onChange={set('direccion')} />
      <Field label="Comuna" value={form.comuna} onChange={set('comuna')} />
      <Field label="Nivel Educacional" value={form.nivelEducacional} onChange={set('nivelEducacional')} options={['Básica Incompleta','Básica Completa','Media Incompleta','Media Completa','Técnico Superior','Universitaria','Postgrado']} />
    </div>
  )
}

function NotasInline({ student }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="text-left py-2 pr-4">Asignatura</th>
            <th className="text-center py-2 px-3">N°1</th>
            <th className="text-center py-2 px-3">N°2</th>
            <th className="text-center py-2 px-3">N°3</th>
            <th className="text-center py-2 px-3">N°4</th>
            <th className="text-center py-2 px-3">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {student.notas.map((n, i) => (
            <tr key={i} className="border-b border-gray-800/50">
              <td className="py-2 pr-4">{n.asignatura}</td>
              {[n.n1,n.n2,n.n3,n.n4].map((v,j) => <td key={j} className="text-center py-2"><span className={v>=4?'text-green-400':'text-red-400'}>{v.toFixed(1)}</span></td>)}
              <td className="text-center py-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${n.promedio>=5.5?'bg-green-500/20 text-green-400':n.promedio>=4?'bg-yellow-500/20 text-yellow-400':'bg-red-500/20 text-red-400'}`}>{n.promedio.toFixed(1)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AsistenciaInline({ student }) {
  const total = student.asistencia.reduce((a,m)=>a+m.dias,0)
  const presentes = student.asistencia.reduce((a,m)=>a+m.presentes,0)
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-green-400">{total?((presentes/total)*100).toFixed(1):0}%</p>
          <p className="text-xs text-gray-400">Global</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-xl font-bold">{presentes}</p>
          <p className="text-xs text-gray-400">Presentes</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-red-400">{total-presentes}</p>
          <p className="text-xs text-gray-400">Ausentes</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-800 text-gray-400"><th className="text-left py-2">Mes</th><th className="text-center py-2">Días</th><th className="text-center py-2">Presentes</th><th className="text-center py-2">Ausentes</th><th className="text-center py-2">%</th></tr></thead>
        <tbody>
          {student.asistencia.map((m,i)=>(
            <tr key={i} className="border-b border-gray-800/50">
              <td className="py-2">{m.mes}</td>
              <td className="text-center py-2">{m.dias}</td>
              <td className="text-center py-2 text-green-400">{m.presentes}</td>
              <td className="text-center py-2 text-red-400">{m.ausentes}</td>
              <td className="text-center py-2"><span className={`px-2 py-0.5 rounded text-xs ${m.porcentaje>=85?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{m.porcentaje}%</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HojaVidaInline({ student, onSave }) {
  const [anotaciones, setAnotaciones] = useState([...student.anotaciones])
  const [filtro, setFiltro] = useState('TODOS')
  const [showForm, setShowForm] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [form, setForm] = useState({ tipo:'', detalle:'', fecha:'', creadoPor:'' })

  const filtered = filtro === 'TODOS' ? anotaciones : anotaciones.filter(a => a.tipo === filtro)
  const openNew = () => { setForm({tipo:'',detalle:'',fecha:'',creadoPor:''}); setEditIdx(null); setShowForm(true) }
  const openEdit = i => { setForm({...anotaciones[i]}); setEditIdx(i); setShowForm(true) }
  const saveForm = () => {
    let copy
    if (editIdx !== null) { copy = [...anotaciones]; copy[editIdx] = form }
    else { copy = [...anotaciones, form] }
    setAnotaciones(copy); onSave({ ...student, anotaciones: copy }); setShowForm(false)
  }
  const del = i => { const copy = anotaciones.filter((_,idx)=>idx!==i); setAnotaciones(copy); onSave({...student,anotaciones:copy}) }

  return showForm ? (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{editIdx!==null?'Editar':'Nuevo'} Antecedente</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tipo" value={form.tipo} onChange={v=>setForm(f=>({...f,tipo:v}))} options={TIPOS_ANOTACION.slice(1)} required />
        <Field label="Fecha" value={form.fecha} onChange={v=>setForm(f=>({...f,fecha:v}))} type="date" />
        <Field label="Creado por" value={form.creadoPor} onChange={v=>setForm(f=>({...f,creadoPor:v}))} />
      </div>
      <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white h-20 resize-none" placeholder="Detalle..." value={form.detalle} onChange={e=>setForm(f=>({...f,detalle:e.target.value}))} />
      <div className="flex gap-3 justify-end">
        <button onClick={()=>setShowForm(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
        <button onClick={saveForm} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg">Guardar</button>
      </div>
    </div>
  ) : (
    <>
      <div className="flex gap-3 mb-4">
        <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" value={filtro} onChange={e=>setFiltro(e.target.value)}>
          {TIPOS_ANOTACION.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={openNew} className="ml-auto px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg">+ Agregar</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-800 text-gray-400"><th className="text-left py-2 pr-2">Tipo</th><th className="text-left py-2 pr-2">Detalle</th><th className="text-left py-2 pr-2">Fecha</th><th className="text-left py-2">Acciones</th></tr></thead>
        <tbody>
          {filtered.map((a,i)=>(
            <tr key={i} className="border-b border-gray-800/50">
              <td className="py-2 pr-2"><span className={`px-1.5 py-0.5 rounded text-xs ${a.tipo.includes('POSITIVA')||a.tipo.includes('RECONOC')?'bg-green-500/20 text-green-400':a.tipo.includes('NEGATIVA')||a.tipo.includes('FALTA')?'bg-red-500/20 text-red-400':'bg-blue-500/20 text-blue-400'}`}>{a.tipo}</span></td>
              <td className="py-2 pr-2 text-gray-300 max-w-[140px] truncate text-xs">{a.detalle}</td>
              <td className="py-2 pr-2 text-gray-400 text-xs">{a.fecha}</td>
              <td className="py-2">
                <div className="flex gap-1">
                  <button onClick={()=>openEdit(anotaciones.indexOf(a))} className="w-6 h-6 bg-blue-600/20 hover:bg-blue-600/40 rounded flex items-center justify-center text-xs">✏️</button>
                  <button onClick={()=>del(anotaciones.indexOf(a))} className="w-6 h-6 bg-red-600/20 hover:bg-red-600/40 rounded flex items-center justify-center text-xs">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length===0&&<tr><td colSpan={4} className="py-6 text-center text-gray-500 text-sm">Sin antecedentes</td></tr>}
        </tbody>
      </table>
    </>
  )
}

// ─── Action Dropdown ─────────────────────────────────────────────────────────

const ACTIONS = [
  { type: 'ficha',          label: '📋 Ver ficha completa' },
  { type: 'identificacion', label: '✏️ Editar identificación' },
  { type: 'apoderado',      label: '👨‍👧 Apoderado' },
  { type: 'notas',          label: '📊 Notas' },
  { type: 'asistencia',     label: '📅 Asistencia' },
  { type: 'hojavida',       label: '📝 Hoja de vida' },
]

function ActionMenu({ student, onSelect }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = React.useRef(null)

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const menuH = ACTIONS.length * 40
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < menuH + 8 ? rect.top - menuH - 4 : rect.bottom + 4
      setPos({ top, left: rect.left })
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
            className="fixed z-[999] w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            {ACTIONS.map(a => (
              <button
                key={a.type}
                onClick={() => { onSelect(a.type); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {a.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const cursos = Object.keys(CURSOS_DATA)
  const [cursoBuscado, setCursoBuscado] = useState(cursos[0])
  const [search, setSearch] = useState('')
  const [students, setStudents] = useState(ALL_STUDENTS)
  const [modal, setModal] = useState(null) // { type, student }

  const updateStudent = updated => setStudents(ss => ss.map(s => s.id === updated.id ? updated : s))
  const addStudent = s => setStudents(ss => [...ss, s])

  const filtered = students.filter(s => {
    const matchCurso = s.curso === cursoBuscado
    const matchSearch = !search || s.nombre.toLowerCase().includes(search.toLowerCase()) || s.rut.includes(search)
    return matchCurso && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Listado de Estudiantes</h1>
          <button
            onClick={() => setModal({ type: 'agregar' })}
            className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Agregar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex-1 min-w-[200px]">
            <select
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              value={cursoBuscado}
              onChange={e => setCursoBuscado(e.target.value)}
            >
              {cursos.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input
            className="flex-1 min-w-[200px] bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="Buscar por nombre o RUT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3">Nombre Completo</th>
                <th className="text-left px-5 py-3">RUT</th>
                <th className="text-left px-5 py-3">Curso</th>
                <th className="text-left px-5 py-3">Estado</th>
                <th className="text-left px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">Sin estudiantes en este curso</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{s.nombre}</td>
                  <td className="px-5 py-3 text-gray-400">{s.rut}</td>
                  <td className="px-5 py-3">{s.curso}</td>
                  <td className="px-5 py-3"><Badge estado={s.estado} /></td>
                  <td className="px-5 py-3">
                    <ActionMenu student={s} onSelect={(type) => setModal({ type, student: s })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">{filtered.length} estudiante{filtered.length !== 1 ? 's' : ''} en {cursoBuscado}</p>
      </main>

      <Footer />

      {/* Modals */}
      {modal?.type === 'agregar' && (
        <ModalAgregar cursos={cursos} onSave={addStudent} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'ficha' && (
        <FichaCompleta student={modal.student} onSave={updateStudent} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'identificacion' && (
        <FichaIdentificacion student={modal.student} onSave={updateStudent} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'apoderado' && (
        <FichaApoderado student={modal.student} onSave={updateStudent} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'notas' && (
        <FichaNotas student={modal.student} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'asistencia' && (
        <FichaAsistencia student={modal.student} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'hojavida' && (
        <FichaHojaVida student={modal.student} onSave={updateStudent} onClose={() => setModal(null)} />
      )}
    </div>
  )
}