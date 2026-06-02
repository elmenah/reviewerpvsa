export default function Spinner({ message = 'Analizando documentos...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 border-4 border-pvsa-light border-t-pvsa-navy rounded-full animate-spin" />
      <p className="text-pvsa-navy font-medium">{message}</p>
      <p className="text-gray-400 text-sm">Esto puede tomar 15–30 segundos</p>
    </div>
  )
}
