export default function Header() {
  return (
    <header className="bg-pvsa-navy text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            Puerto Ventanas S.A.
          </h1>
          <p className="text-blue-200 text-sm">
            Revisor de Procedimientos y Matrices — Empresas Contratistas
          </p>
        </div>
        <div className="text-right text-xs text-blue-300 hidden sm:block">
          <p>Sistema Integrado de Gestión</p>
          <p>Basado en estándares PVSA vigentes</p>
        </div>
      </div>
    </header>
  )
}
