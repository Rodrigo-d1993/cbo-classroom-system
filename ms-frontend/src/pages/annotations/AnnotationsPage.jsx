import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MOCK_ANNOTATIONS = [
  { id: 1, estudiante: 'Carlos Pérez',   tipo: 'Negativa',  descripcion: 'No trajo materiales a clases.',        fecha: '2026-06-10' },
  { id: 2, estudiante: 'Ana García',     tipo: 'Positiva',  descripcion: 'Excelente participación en la clase.', fecha: '2026-06-11' },
  { id: 3, estudiante: 'Diego Martínez', tipo: 'Negativa',  descripcion: 'Llegó tarde por tercera vez.',         fecha: '2026-06-12' },
]

export default function AnnotationsPage() {
  const [anotaciones, setAnotaciones] = useState(MOCK_ANNOTATIONS)
  const [nueva, setNueva] = useState({ estudiante: '', tipo: 'Positiva', descripcion: '' })

  function handleAgregar() {
    if (!nueva.estudiante || !nueva.descripcion) return
    setAnotaciones(prev => [...prev, { ...nueva, id: Date.now(), fecha: new Date().toISOString().split('T')[0] }])
    setNueva({ estudiante: '', tipo: 'Positiva', descripcion: '' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Navbar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 space-y-6">
          <h1 className="text-xl font-bold">Anotaciones</h1>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
            <p className="text-sm font-medium text-gray-300">Nueva anotación</p>
            <input
              placeholder="Nombre del estudiante"
              value={nueva.estudiante}
              onChange={e => setNueva(p => ({ ...p, estudiante: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <select
              value={nueva.tipo}
              onChange={e => setNueva(p => ({ ...p, tipo: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option>Positiva</option>
              <option>Negativa</option>
              <option>Informativa</option>
            </select>
            <textarea
              placeholder="Descripción de la anotación"
              value={nueva.descripcion}
              onChange={e => setNueva(p => ({ ...p, descripcion: e.target.value }))}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
            />
            <button onClick={handleAgregar} className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition-colors">
              Agregar anotación
            </button>
          </div>

          <div className="space-y-3">
            {anotaciones.map(a => (
              <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{a.estudiante}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.tipo === 'Positiva' ? 'bg-green-500/20 text-green-400' : a.tipo === 'Negativa' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {a.tipo}
                    </span>
                    <span className="text-gray-500 text-xs">{a.fecha}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{a.descripcion}</p>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}