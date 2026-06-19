import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginRequest } from '../../api/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await loginRequest(username, password)
      login(data.token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.')
      } else {
        setError('Error al conectar con el servidor. Intenta más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#111f3e' }} className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div
            style={{ backgroundColor: '#03c2fe', color: '#111f3e' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          >
            <span className="text-2xl font-bold">CBO</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Colegio Bernardo O'Higgins</h1>
          <p style={{ color: '#87c8e8' }} className="text-sm mt-1">Libro de Clases Digital</p>
        </div>

        {/* Card */}
        <div
          style={{ backgroundColor: '#0d4977', border: '1px solid #087cb9' }}
          className="rounded-2xl p-8"
        >
          <h2 className="text-white text-lg font-semibold mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ color: '#87c8e8' }} className="block text-sm mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
                style={{ backgroundColor: '#111f3e', border: '1px solid #087cb9', color: 'white' }}
                className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                onFocus={e  => e.target.style.borderColor = '#03c2fe'}
                onBlur={e   => e.target.style.borderColor = '#087cb9'}
              />
            </div>

            <div>
              <label style={{ color: '#87c8e8' }} className="block text-sm mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                style={{ backgroundColor: '#111f3e', border: '1px solid #087cb9', color: 'white' }}
                className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                onFocus={e => e.target.style.borderColor = '#03c2fe'}
                onBlur={e  => e.target.style.borderColor = '#087cb9'}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#087cb9' : '#03c2fe',
                color: '#111f3e',
              }}
              className="w-full font-medium rounded-lg py-2.5 text-sm transition-colors hover:opacity-90 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{ color: '#087cb9' }} className="text-center text-xs mt-6">
          Sistema de uso exclusivo del personal autorizado
        </p>
      </div>
    </div>
  )
}