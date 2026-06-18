import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MOCK_STUDENTS = [
  { id: 1, nombre: 'Ana García',      rut: '21.111.111-1', curso: '1°A', estado: 'Activo' },
  { id: 2, nombre: 'Carlos Pérez',    rut: '21.222.222-2', curso: '1°A', estado: 'Activo' },
  { id: 3, nombre: 'Valentina López', rut: '21.333.333-3', curso: '2°B', estado: 'Activo' },
  { id: 4, nombre: 'Diego Martínez',  rut: '21.444.444-4', curso: '2°B', estado: 'Inactivo' },
  { id: 5, nombre: 'Sofía Rojas',     rut: '21.555.555-5', curso: '3°C', estado: 'Activo' },
]

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
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
    </div>
  )
}