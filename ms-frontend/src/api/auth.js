const MOCK_USERS = [
  { username: 'admin',     password: '1234', token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5fU0lTVEVNQSIsImV4cCI6OTk5OTk5OTk5OX0.mock' },
  { username: 'director',  password: '1234', token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiZGlyZWN0b3IiLCJyb2xlIjoiRElSRUNUT1IiLCJleHAiOjk5OTk5OTk5OTl9.mock' },
  { username: 'docente',   password: '1234', token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMsInVzZXJuYW1lIjoiZG9jZW50ZSIsInJvbGUiOiJET0NFTlRFIiwiZXhwIjo5OTk5OTk5OTk5fQ.mock' },
  { username: 'inspector', password: '1234', token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiaW5zcGVjdG9yIiwicm9sZSI6IklOU1BFQ1RPUiIsImV4cCI6OTk5OTk5OTk5OX0.mock' },
  { username: 'apoderado', password: '1234', token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiYXBvZGVyYWRvIiwicm9sZSI6IEFQT0RFUkFETyIsImV4cCI6OTk5OTk5OTk5OX0.mock' },
]

export async function loginRequest(username, password) {
  await new Promise(res => setTimeout(res, 600))

  const user = MOCK_USERS.find(u => u.username === username && u.password === password)

  if (!user) {
    const error = new Error('Credenciales incorrectas')
    error.response = { status: 401 }
    throw error
  }

  return { token: user.token }
}