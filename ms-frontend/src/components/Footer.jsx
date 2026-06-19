export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: '#0d4977', borderTop: '1px solid #087cb9', marginTop: 'auto' }}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <p style={{ color: '#087cb9' }} className="text-xs">
          © {year} Colegio Bernardo O'Higgins — Libro de Clases Digital
        </p>
        <p style={{ color: '#087cb9' }} className="text-xs">
          v1.0.0 — Solo para uso interno autorizado
        </p>
      </div>
    </footer>
  )
}