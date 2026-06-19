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

const OPTIONS = ['P', 'A', 'J']

export default function AttendancePage() {
  const [curso, setCurso] = useState('1°A')
  const [asistencia, setAsistencia] = useState({})
  const [guardado, setGuardado] = useState(false)

  function toggle(id, valor) {
    setAsistencia(prev => {
      // si clickeas el mismo valor, se desmarca
      if (prev[id] === valor) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }

      return {
        ...prev,
        [id]: valor,
      }
    })

    setGuardado(false)
  }

  function marcarTodos(valor) {
    const nuevo = {}
    MOCK_STUDENTS.forEach(s => {
      nuevo[s.id] = valor
    })
    setAsistencia(nuevo)
    setGuardado(false)
  }

  function limpiar() {
    setAsistencia({})
    setGuardado(false)
  }

  function handleGuardar() {
    console.log('Curso:', curso)
    console.log('Asistencia:', asistencia)
    setGuardado(true)
  }

  const resumen = {
    P: Object.values(asistencia).filter(v => v === 'P').length,
    A: Object.values(asistencia).filter(v => v === 'A').length,
    J: Object.values(asistencia).filter(v => v === 'J').length,
  }

  return (
    <div className="min-h-screen flex bg-gray-950">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-8 pt-4 pb-8">
          <div className="max-w-6xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-white">
                  Registrar Asistencia
                </h1>

                <p className="text-gray-400 text-sm mt-1">
                  {new Date().toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <select
                value={curso}
                onChange={e => setCurso(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2"
              >
                <option>1°A</option>
                <option>1°B</option>
                <option>2°A</option>
                <option>2°B</option>
                <option>3°C</option>
              </select>
            </div>

            {/* RESUMEN */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-2 text-green-300 text-sm">
                Presentes: {resumen.P}
              </div>
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-2 text-red-300 text-sm">
                Ausentes: {resumen.A}
              </div>
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-2 text-yellow-300 text-sm">
                Justificados: {resumen.J}
              </div>
            </div>

            {/* ACCIONES MASIVAS */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => marcarTodos('P')}
                className="bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
              >
                Todos Presente
              </button>

              <button
                onClick={() => marcarTodos('A')}
                className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
              >
                Todos Ausente
              </button>

              <button
                onClick={limpiar}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
              >
                Limpiar
              </button>
            </div>

            {/* LISTA */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-4">
              {MOCK_STUDENTS.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i < MOCK_STUDENTS.length - 1
                      ? 'border-b border-gray-800'
                      : ''
                  }`}
                >
                  <span className="text-sm text-white">
                    {s.nombre}
                  </span>

                  <div className="flex gap-2">
                    {OPTIONS.map(val => (
                      <button
                        key={val}
                        onClick={() => toggle(s.id, val)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          asistencia[s.id] === val
                            ? val === 'P'
                              ? 'bg-green-600 text-white'
                              : val === 'A'
                              ? 'bg-red-600 text-white'
                              : 'bg-yellow-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {val === 'P'
                          ? 'Presente'
                          : val === 'A'
                          ? 'Ausente'
                          : 'Justificado'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* GUARDAR */}
            <button
              onClick={handleGuardar}
              className="w-full bg-blue-600 hover:bg-blue-500 text-sm font-medium py-2.5 rounded-lg transition-colors text-white"
            >
              Guardar asistencia
            </button>

            {guardado && (
              <p className="text-center text-green-400 text-sm mt-3">
                ✓ Asistencia guardada correctamente
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}