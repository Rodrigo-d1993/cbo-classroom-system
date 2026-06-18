import { createContext, useContext, useState, useEffect } from 'react'
import { getRoleFromToken, getUserIdFromToken, isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cbo_token'))
  const [role, setRole] = useState(() => {
    const t = localStorage.getItem('cbo_token')
    return t ? getRoleFromToken(t) : null
  })
  const [userId, setUserId] = useState(() => {
    const t = localStorage.getItem('cbo_token')
    return t ? getUserIdFromToken(t) : null
  })

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout()
    }
  }, [token])

  function login(newToken) {
    localStorage.setItem('cbo_token', newToken)
    setToken(newToken)
    setRole(getRoleFromToken(newToken))
    setUserId(getUserIdFromToken(newToken))
  }

  function logout() {
    localStorage.removeItem('cbo_token')
    setToken(null)
    setRole(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}