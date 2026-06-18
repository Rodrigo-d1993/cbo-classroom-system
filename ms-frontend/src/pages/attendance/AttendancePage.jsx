import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MOCK_STUDENTS = [
  { id: 1, nombre: 'Ana García' },
  { id: 2, nombre: 'Carlos Pérez' },
  { id: 3, nombre: 'Valentina López' },
  { id: 4, nombre: 'Diego Martínez' },
  { id: 5, nombre: 'Sofía Rojas' },
]

export default function AttendancePage() {
  const [curso, setCurso] = useState('1°A')
  const [asistencia, setAsistencia] = useState({})
  const [guardado, setGuardado] = useState(false)

  function toggle(id, valor) {
    setAsistencia(prev => ({ ...prev, [id]: valor }))
    setGuardado(false)
  }

  function handleGuardar() {
    console.log('Asistencia guardada:', asistencia)
    setGuardado(true)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Registrar Asistencia</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <select
            value={curso}
            onChange={e => setCurso(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option>1°A</option>
            <option>1°B</option>
            <option>2°A</option>
            <option>2°B</option>
            <option>3°C</option>
          </select>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-4">
          {MOCK_STUDENTS.map((s, i) => (
            <div key={s.id} className={`flex items-center justify-between px-5 py-4 ${i < MOCK_STUDENTS.length - 1 ? 'border-b border-gray-800' : ''}`}>
              <span className="text-sm">{s.nombre}</span>
              <div className="flex gap-2">
                {['P', 'A', 'J'].map(val => (
                  <button
                    key={val}
                    onClick={() => toggle(s.id, val)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      asistencia[s.id] === val
                        ? val === 'P' ? 'bg-green-600 text-white'
                        : val === 'A' ? 'bg-red-600 text-white'
                        : 'bg-yellow-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {val === 'P' ? 'Presente' : val === 'A' ? 'Ausente' : 'Justificado'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleGuardar}
          className="w-full bg-blue-600 hover:bg-blue-500 text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Guardar asistencia
        </button>

        {guardado && (
          <p className="text-center text-green-400 text-sm mt-3">✓ Asistencia guardada correctamente</p>
        )}
      </main>
      <Footer />
    </div>
  )
}