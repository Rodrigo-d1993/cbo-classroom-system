export function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function getRoleFromToken(token) {
  const decoded = decodeToken(token)
  return decoded?.role || null
}

export function getUserIdFromToken(token) {
  const decoded = decodeToken(token)
  return decoded?.userId || null
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded?.exp) return true
  return decoded.exp * 1000 < Date.now()
}