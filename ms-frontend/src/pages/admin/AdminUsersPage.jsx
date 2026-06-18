import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MOCK_USERS = [
  { id: 1, username: 'admin',     nombre: 'Roberto Admin',   rol: 'ADMIN_SISTEMA', estado: 'Activo' },
  { id: 2, username: 'director',  nombre: 'María Directora', rol: 'DIRECTOR',      estado: 'Activo' },
  { id: 3, username: 'docente',   nombre: 'Juan Docente',    rol: 'DOCENTE',       estado: 'Activo' },
  { id: 4, username: 'inspector', nombre: 'Pedro Inspector', rol: 'INSPECTOR',     estado: 'Activo' },
  { id: 5, username: 'apoderado', nombre: 'Laura Apoderada', rol: 'APODERADO',     estado: 'Inactivo' },
]

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Gestión de Usuarios</h1>
          <button className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition-colors">+ Nuevo usuario</button>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3">Nombre</th>
                <th className="text-left px-5 py-3">Username</th>
                <th className="text-left px-5 py-3">Rol</th>
                <th className="text-left px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(u => (
                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">{u.nombre}</td>
                  <td className="px-5 py-3 text-gray-400">{u.username}</td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{u.rol}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.estado === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.estado}
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