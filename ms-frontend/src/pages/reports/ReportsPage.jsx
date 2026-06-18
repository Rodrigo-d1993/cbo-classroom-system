import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <h1 className="text-xl font-bold mb-6">Reportes</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">Módulo en construcción — disponible cuando ms-reports esté listo.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}