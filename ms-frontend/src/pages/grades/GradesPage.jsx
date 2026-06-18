import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MOCK_GRADES = [
  { id: 1, nombre: 'Ana García',      nota1: 6.5, nota2: 5.8, nota3: 6.2, promedio: 6.2 },
  { id: 2, nombre: 'Carlos Pérez',    nota1: 4.5, nota2: 5.0, nota3: 4.8, promedio: 4.8 },
  { id: 3, nombre: 'Valentina López', nota1: 7.0, nota2: 6.8, nota3: 6.9, promedio: 6.9 },
  { id: 4, nombre: 'Diego Martínez',  nota1: 3.9, nota2: 4.2, nota3: 4.0, promedio: 4.0 },
  { id: 5, nombre: 'Sofía Rojas',     nota1: 5.5, nota2: 6.0, nota3: 5.8, promedio: 5.8 },
]

function colorNota(n) {
  if (n >= 6.0) return 'text-green-400'
  if (n >= 4.0) return 'text-yellow-400'
  return 'text-red-400'
}

export default function GradesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <h1 className="text-xl font-bold mb-6">Calificaciones — 1°A</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3">Estudiante</th>
                <th className="text-center px-5 py-3">Nota 1</th>
                <th className="text-center px-5 py-3">Nota 2</th>
                <th className="text-center px-5 py-3">Nota 3</th>
                <th className="text-center px-5 py-3">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GRADES.map(s => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">{s.nombre}</td>
                  <td className={`px-5 py-3 text-center ${colorNota(s.nota1)}`}>{s.nota1}</td>
                  <td className={`px-5 py-3 text-center ${colorNota(s.nota2)}`}>{s.nota2}</td>
                  <td className={`px-5 py-3 text-center ${colorNota(s.nota3)}`}>{s.nota3}</td>
                  <td className={`px-5 py-3 text-center font-semibold ${colorNota(s.promedio)}`}>{s.promedio}</td>
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