export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <p className="text-gray-600 text-xs">
          © {year} Colegio Bernardo O'Higgins — Libro de Clases Digital
        </p>
        <p className="text-gray-700 text-xs">
          v1.0.0 — Solo para uso interno autorizado
        </p>
      </div>
    </footer>
  )
}