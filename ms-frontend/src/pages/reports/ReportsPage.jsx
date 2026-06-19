import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Navbar />
<<<<<<< Updated upstream
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <h1 className="text-xl font-bold mb-6">Reportes</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">Módulo en construcción — disponible cuando ms-reports esté listo.</p>
=======

      <div className="flex-1 flex flex-col min-w-0">
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
>>>>>>> Stashed changes
        </div>
      </main>
      <Footer />
<<<<<<< Updated upstream
=======
      </div>

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
>>>>>>> Stashed changes
    </div>

  )
}