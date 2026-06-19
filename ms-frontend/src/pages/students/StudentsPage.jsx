import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MOCK_STUDENTS = [
  { id: 1, nombre: 'Ana García',      rut: '21.111.111-1', curso: '1°A', estado: 'Activo' },
  { id: 2, nombre: 'Carlos Pérez',    rut: '21.222.222-2', curso: '1°A', estado: 'Activo' },
  { id: 3, nombre: 'Valentina López', rut: '21.333.333-3', curso: '2°B', estado: 'Activo' },
  { id: 4, nombre: 'Diego Martínez',  rut: '21.444.444-4', curso: '2°B', estado: 'Inactivo' },
  { id: 5, nombre: 'Sofía Rojas',     rut: '21.555.555-5', curso: '3°C', estado: 'Activo' },
]

<<<<<<< Updated upstream
=======
function Badge({ estado }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={
        estado === 'Activo'
          ? { backgroundColor: '#E3F7FA', color: '#007695' }
          : { backgroundColor: '#DCE6E9', color: '#004761' }
      }
    >
      {estado}
    </span>
  )
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-[#BEEAF0] mb-6">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            active === t
              ? 'border-[#007695] text-[#007695]'
              : 'border-transparent text-[#004761] hover:text-[#002437]'
          }`}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`bg-white border border-[#BEEAF0] rounded-2xl flex flex-col max-h-[90vh] ${wide ? 'w-full max-w-4xl' : 'w-full max-w-xl'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#BEEAF0]">
          <h2 className="text-base font-bold text-[#002437]">{title}</h2>
          <button onClick={onClose} className="text-[#004761] hover:text-[#002437] text-xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1 text-[#002437]">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', options, required }) {
  const cls = "w-full bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437] focus:outline-none focus:border-[#00B2D3]"
  return (
    <div>
      <label className="block text-xs text-[#004761] mb-1">{label}{required && <span className="text-[#007695] ml-0.5">*</span>}</label>
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
      <p className="text-xs text-[#004761] mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
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
        <button onClick={onClose} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437] transition-colors">Volver</button>
        <button onClick={() => { onSave(form); onClose() }} className="px-4 py-2 text-sm text-white rounded-lg transition-colors" style={{ backgroundColor: '#007695' }}>Guardar</button>
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
      <p className="text-xs text-[#004761] mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <h3 className="text-sm font-semibold mb-4 text-[#002437]">Ficha de Familiar / Apoderado</h3>
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
        <button onClick={onClose} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437] transition-colors">Volver</button>
        <button onClick={() => { onSave({ ...student, apoderado: form }); onClose() }} className="px-4 py-2 text-sm text-white rounded-lg transition-colors" style={{ backgroundColor: '#007695' }}>Guardar</button>
      </div>
    </Modal>
  )
}

// Notas
function FichaNotas({ student, onClose }) {
  return (
    <Modal title="Notas" onClose={onClose} wide>
      <p className="text-xs text-[#004761] mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#BEEAF0] text-[#004761]">
              <th className="text-left py-2 pr-4">Asignatura</th>
              <th className="text-center py-2 px-3">N°1</th>
              <th className="text-center py-2 px-3">N°2</th>
              <th className="text-center py-2 px-3">N°3</th>
              <th className="text-center py-2 px-3">N°4</th>
              <th className="text-center py-2 px-3 font-semibold text-[#002437]">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {student.notas.map((n, i) => (
              <tr key={i} className="border-b border-[#D7EEF2]">
                <td className="py-2 pr-4 font-medium">{n.asignatura}</td>
                {[n.n1, n.n2, n.n3, n.n4].map((v, j) => (
                  <td key={j} className="text-center py-2 px-3">
                    <span style={{ color: v >= 4 ? '#007695' : '#004761' }} className="px-2 py-0.5 rounded text-xs">{v.toFixed(1)}</span>
                  </td>
                ))}
                <td className="text-center py-2 px-3">
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-bold"
                    style={
                      n.promedio >= 5.5 ? { backgroundColor: '#E3F7FA', color: '#007695' }
                      : n.promedio >= 4 ? { backgroundColor: '#DCE6E9', color: '#004761' }
                      : { backgroundColor: '#DCE6E9', color: '#004761' }
                    }
                  >
                    {n.promedio.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437] transition-colors">Cerrar</button>
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
      <p className="text-xs text-[#004761] mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#E3F7FA] border border-[#BEEAF0] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#007695]">{pct}%</p>
          <p className="text-xs text-[#004761] mt-1">Asistencia Global</p>
        </div>
        <div className="bg-white border border-[#BEEAF0] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#002437]">{presentes}</p>
          <p className="text-xs text-[#004761] mt-1">Días Presentes</p>
        </div>
        <div className="bg-[#DCE6E9] border border-[#C7D3D6] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#004761]">{total - presentes}</p>
          <p className="text-xs text-[#004761] mt-1">Días Ausentes</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#BEEAF0] text-[#004761]">
            <th className="text-left py-2">Mes</th>
            <th className="text-center py-2">Días Hábiles</th>
            <th className="text-center py-2">Presentes</th>
            <th className="text-center py-2">Ausentes</th>
            <th className="text-center py-2">% Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {student.asistencia.map((m, i) => (
            <tr key={i} className="border-b border-[#D7EEF2]">
              <td className="py-2 font-medium">{m.mes}</td>
              <td className="text-center py-2">{m.dias}</td>
              <td className="text-center py-2 text-[#007695]">{m.presentes}</td>
              <td className="text-center py-2 text-[#004761]">{m.ausentes}</td>
              <td className="text-center py-2">
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={m.porcentaje >= 85 ? { backgroundColor: '#E3F7FA', color: '#007695' } : { backgroundColor: '#DCE6E9', color: '#004761' }}
                >
                  {m.porcentaje}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437] transition-colors">Cerrar</button>
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

  const tipoColor = tipo =>
    tipo.includes('POSITIVA') || tipo.includes('RECONOC') ? { backgroundColor: '#E3F7FA', color: '#007695' }
    : tipo.includes('NEGATIVA') || tipo.includes('FALTA') ? { backgroundColor: '#DCE6E9', color: '#004761' }
    : { backgroundColor: '#E3F7FA', color: '#00B2D3' }

  return (
    <Modal title="Hoja de Vida" onClose={() => { onSave({ ...student, anotaciones }); onClose() }} wide>
      <p className="text-xs text-[#004761] mb-4">Estudiante: {student.nombre} / RUT: {student.rut} / {student.curso}</p>
      {showForm ? (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#002437]">{editIdx !== null ? 'Editar Antecedente' : 'Agregar Antecedente'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tipo Antecedente" value={form.tipo} onChange={v => setForm(f => ({...f, tipo: v}))} options={TIPOS_ANOTACION.slice(1)} required />
            <Field label="Fecha" value={form.fecha} onChange={v => setForm(f => ({...f, fecha: v}))} type="date" />
            <Field label="Creado por" value={form.creadoPor} onChange={v => setForm(f => ({...f, creadoPor: v}))} />
          </div>
          <div>
            <label className="block text-xs text-[#004761] mb-1">Detalle</label>
            <textarea className="w-full bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437] focus:outline-none focus:border-[#00B2D3] h-24 resize-none" value={form.detalle} onChange={e => setForm(f => ({...f, detalle: e.target.value}))} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437]">Cancelar</button>
            <button onClick={saveForm} className="px-4 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: '#007695' }}>Guardar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select className="bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437] focus:outline-none" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              {TIPOS_ANOTACION.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="ml-auto">
              <button onClick={openNew} className="px-4 py-2 text-sm text-white rounded-lg transition-colors" style={{ backgroundColor: '#007695' }}>+ Agregar Antecedente</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#BEEAF0] text-[#004761]">
                  <th className="text-left py-2 pr-3">Tipo Antecedente</th>
                  <th className="text-left py-2 pr-3">Detalle</th>
                  <th className="text-left py-2 pr-3">Fecha</th>
                  <th className="text-left py-2 pr-3">Creado por</th>
                  <th className="text-left py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="border-b border-[#D7EEF2]">
                    <td className="py-2 pr-3">
                      <span className="px-2 py-0.5 rounded text-xs" style={tipoColor(a.tipo)}>{a.tipo}</span>
                    </td>
                    <td className="py-2 pr-3 text-[#00839C] max-w-[180px] truncate">{a.detalle}</td>
                    <td className="py-2 pr-3 text-[#004761] whitespace-nowrap">{a.fecha}</td>
                    <td className="py-2 pr-3 text-[#004761]">{a.creadoPor}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(anotaciones.indexOf(a))} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors" style={{ backgroundColor: '#E3F7FA', color: '#00B2D3' }}>✏️</button>
                        <button onClick={() => deleteAnotacion(anotaciones.indexOf(a))} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors" style={{ backgroundColor: '#DCE6E9', color: '#004761' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-[#004761] text-sm">Sin antecedentes registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => { onSave({ ...student, anotaciones }); onClose() }} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437]">Cerrar</button>
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
        <button onClick={onClose} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437]">Cancelar</button>
        <button
          onClick={() => {
            if (!form.nombre || !form.rut || !form.curso) return
            onSave({ ...form, id: Date.now(), apoderado: { nombre:'',rut:'',telefono:'',email:'',vinculo:'',direccion:'',comuna:'',nivelEducacional:'' }, notas: [], asistencia: [], anotaciones: [] })
            onClose()
          }}
          className="px-4 py-2 text-sm text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#007695' }}
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
      <div className="flex justify-end mt-4 pt-4 border-t border-[#BEEAF0]">
        <button onClick={() => { onSave(s); onClose() }} className="px-4 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: '#007695' }}>Cerrar y Guardar</button>
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
          <tr className="border-b border-[#BEEAF0] text-[#004761]">
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
            <tr key={i} className="border-b border-[#D7EEF2]">
              <td className="py-2 pr-4">{n.asignatura}</td>
              {[n.n1,n.n2,n.n3,n.n4].map((v,j) => (
                <td key={j} className="text-center py-2">
                  <span style={{ color: v >= 4 ? '#007695' : '#004761' }}>{v.toFixed(1)}</span>
                </td>
              ))}
              <td className="text-center py-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={
                    n.promedio >= 5.5 ? { backgroundColor: '#E3F7FA', color: '#007695' }
                    : n.promedio >= 4 ? { backgroundColor: '#DCE6E9', color: '#004761' }
                    : { backgroundColor: '#DCE6E9', color: '#004761' }
                  }
                >
                  {n.promedio.toFixed(1)}
                </span>
              </td>
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
        <div className="bg-[#E3F7FA] border border-[#BEEAF0] rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-[#007695]">{total?((presentes/total)*100).toFixed(1):0}%</p>
          <p className="text-xs text-[#004761]">Global</p>
        </div>
        <div className="bg-white border border-[#BEEAF0] rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-[#002437]">{presentes}</p>
          <p className="text-xs text-[#004761]">Presentes</p>
        </div>
        <div className="bg-[#DCE6E9] border border-[#C7D3D6] rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-[#004761]">{total-presentes}</p>
          <p className="text-xs text-[#004761]">Ausentes</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-[#BEEAF0] text-[#004761]"><th className="text-left py-2">Mes</th><th className="text-center py-2">Días</th><th className="text-center py-2">Presentes</th><th className="text-center py-2">Ausentes</th><th className="text-center py-2">%</th></tr></thead>
        <tbody>
          {student.asistencia.map((m,i)=>(
            <tr key={i} className="border-b border-[#D7EEF2]">
              <td className="py-2">{m.mes}</td>
              <td className="text-center py-2">{m.dias}</td>
              <td className="text-center py-2 text-[#007695]">{m.presentes}</td>
              <td className="text-center py-2 text-[#004761]">{m.ausentes}</td>
              <td className="text-center py-2">
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={m.porcentaje>=85 ? { backgroundColor: '#E3F7FA', color: '#007695' } : { backgroundColor: '#DCE6E9', color: '#004761' }}
                >
                  {m.porcentaje}%
                </span>
              </td>
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

  const tipoColor = tipo =>
    tipo.includes('POSITIVA') || tipo.includes('RECONOC') ? { backgroundColor: '#E3F7FA', color: '#007695' }
    : tipo.includes('NEGATIVA') || tipo.includes('FALTA') ? { backgroundColor: '#DCE6E9', color: '#004761' }
    : { backgroundColor: '#E3F7FA', color: '#00B2D3' }

  return showForm ? (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#002437]">{editIdx!==null?'Editar':'Nuevo'} Antecedente</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tipo" value={form.tipo} onChange={v=>setForm(f=>({...f,tipo:v}))} options={TIPOS_ANOTACION.slice(1)} required />
        <Field label="Fecha" value={form.fecha} onChange={v=>setForm(f=>({...f,fecha:v}))} type="date" />
        <Field label="Creado por" value={form.creadoPor} onChange={v=>setForm(f=>({...f,creadoPor:v}))} />
      </div>
      <textarea className="w-full bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437] h-20 resize-none" placeholder="Detalle..." value={form.detalle} onChange={e=>setForm(f=>({...f,detalle:e.target.value}))} />
      <div className="flex gap-3 justify-end">
        <button onClick={()=>setShowForm(false)} className="px-4 py-2 text-sm text-[#004761] hover:text-[#002437]">Cancelar</button>
        <button onClick={saveForm} className="px-4 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: '#007695' }}>Guardar</button>
      </div>
    </div>
  ) : (
    <>
      <div className="flex gap-3 mb-4">
        <select className="bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437]" value={filtro} onChange={e=>setFiltro(e.target.value)}>
          {TIPOS_ANOTACION.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={openNew} className="ml-auto px-3 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: '#007695' }}>+ Agregar</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-[#BEEAF0] text-[#004761]"><th className="text-left py-2 pr-2">Tipo</th><th className="text-left py-2 pr-2">Detalle</th><th className="text-left py-2 pr-2">Fecha</th><th className="text-left py-2">Acciones</th></tr></thead>
        <tbody>
          {filtered.map((a,i)=>(
            <tr key={i} className="border-b border-[#D7EEF2]">
              <td className="py-2 pr-2"><span className="px-1.5 py-0.5 rounded text-xs" style={tipoColor(a.tipo)}>{a.tipo}</span></td>
              <td className="py-2 pr-2 text-[#00839C] max-w-[140px] truncate text-xs">{a.detalle}</td>
              <td className="py-2 pr-2 text-[#004761] text-xs">{a.fecha}</td>
              <td className="py-2">
                <div className="flex gap-1">
                  <button onClick={()=>openEdit(anotaciones.indexOf(a))} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: '#E3F7FA' }}>✏️</button>
                  <button onClick={()=>del(anotaciones.indexOf(a))} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: '#DCE6E9' }}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length===0&&<tr><td colSpan={4} className="py-6 text-center text-[#004761] text-sm">Sin antecedentes</td></tr>}
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white hover:bg-[#E3F7FA] border border-[#BEEAF0] rounded-lg transition-colors text-[#002437]"
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
            className="fixed z-[999] w-52 bg-white border border-[#BEEAF0] rounded-xl shadow-2xl overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            {ACTIONS.map(a => (
              <button
                key={a.type}
                onClick={() => { onSelect(a.type); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-xs text-[#00839C] hover:bg-[#E3F7FA] hover:text-[#002437] transition-colors"
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

>>>>>>> Stashed changes
export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-[#F2FAFB] text-[#002437] flex">
      <Navbar />
<<<<<<< Updated upstream
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Listado de Estudiantes</h1>
          <button className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition-colors">+ Agregar</button>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3">Nombre</th>
                <th className="text-left px-5 py-3">RUT</th>
                <th className="text-left px-5 py-3">Curso</th>
                <th className="text-left px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map(s => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">{s.nombre}</td>
                  <td className="px-5 py-3 text-gray-400">{s.rut}</td>
                  <td className="px-5 py-3">{s.curso}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.estado === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {s.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
=======

      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Listado de Estudiantes</h1>
            <button
              onClick={() => setModal({ type: 'agregar' })}
              className="text-sm px-4 py-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: '#007695' }}
            >
              + Agregar
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex-1 min-w-[200px]">
              <select
                className="w-full bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437] focus:outline-none focus:border-[#00B2D3]"
                value={cursoBuscado}
                onChange={e => setCursoBuscado(e.target.value)}
              >
                {cursos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input
              className="flex-1 min-w-[200px] bg-white border border-[#BEEAF0] rounded-lg px-3 py-2 text-sm text-[#002437] focus:outline-none focus:border-[#00B2D3]"
              placeholder="Buscar por nombre o RUT..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Tabla */}
          <div className="bg-white border border-[#BEEAF0] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#BEEAF0] text-[#004761] bg-[#E3F7FA]">
                  <th className="text-left px-5 py-3">Nombre Completo</th>
                  <th className="text-left px-5 py-3">RUT</th>
                  <th className="text-left px-5 py-3">Curso</th>
                  <th className="text-left px-5 py-3">Estado</th>
                  <th className="text-left px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-[#004761]">Sin estudiantes en este curso</td></tr>
                )}
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-[#D7EEF2] hover:bg-[#E3F7FA]/60 transition-colors">
                    <td className="px-5 py-3 font-medium">{s.nombre}</td>
                    <td className="px-5 py-3 text-[#004761]">{s.rut}</td>
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
          <p className="text-xs text-[#004761] mt-3">{filtered.length} estudiante{filtered.length !== 1 ? 's' : ''} en {cursoBuscado}</p>
        </main>

        <Footer />
      </div>

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
>>>>>>> Stashed changes
    </div>
  )
}