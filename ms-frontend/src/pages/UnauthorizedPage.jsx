import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-700 mb-4">403</p>
        <h1 className="text-xl font-semibold mb-2">Sin permisos</h1>
        <p className="text-gray-400 text-sm mb-6">No tienes acceso a esta sección.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}