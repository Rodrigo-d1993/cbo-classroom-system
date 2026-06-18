import axios from 'axios'

const axiosClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de request — agrega el JWT automáticamente
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('cbo_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response — si el token expiró, cierra sesión
axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cbo_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosClient