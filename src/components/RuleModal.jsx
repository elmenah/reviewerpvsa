import { useEffect } from 'react'

function renderLine(line, i) {
  if (line.startsWith('# ')) {
    return (
      <h2 key={i} className="text-base font-bold text-pvsa-navy mt-4 mb-1">
        {line.slice(2)}
      </h2>
    )
  }
  if (line.startsWith('## ')) {
    return (
      <h3 key={i} className="text-sm font-semibold text-pvsa-blue mt-4 mb-1 uppercase tracking-wide border-b border-pvsa-light pb-1">
        {line.slice(3)}
      </h3>
    )
  }
  if (line.startsWith('### ')) {
    return (
      <h4 key={i} className="text-sm font-semibold text-gray-700 mt-3 mb-1">
        {line.slice(4)}
      </h4>
    )
  }
  if (line.startsWith('> ')) {
    return (
      <blockquote key={i} className="border-l-4 border-amber-400 bg-amber-50 px-3 py-1.5 text-sm italic text-amber-800 my-1.5 rounded-r">
        {line.slice(2)}
      </blockquote>
    )
  }
  if (line === '---') {
    return <hr key={i} className="my-3 border-gray-200" />
  }
  if (line.startsWith('|')) {
    const isHeader = false
    return (
      <div key={i} className="font-mono text-xs text-gray-700 bg-gray-50 px-2 py-0.5 border-b border-gray-100 whitespace-pre-wrap break-all">
        {line}
      </div>
    )
  }
  if (line.startsWith('- ')) {
    const text = line.slice(2)
    const boldText = text.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
    return (
      <div key={i} className="flex gap-2 text-sm text-gray-700 my-0.5 leading-snug">
        <span className="text-pvsa-blue shrink-0 mt-0.5">•</span>
        <span dangerouslySetInnerHTML={{ __html: boldText }} />
      </div>
    )
  }
  if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
    return (
      <p key={i} className="text-sm font-semibold text-gray-800 mt-1">
        {line.slice(2, -2)}
      </p>
    )
  }
  if (line.trim() === '') {
    return <div key={i} className="h-1.5" />
  }
  const inlineBold = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
  return (
    <p key={i} className="text-sm text-gray-700 leading-snug"
      dangerouslySetInnerHTML={{ __html: inlineBold }} />
  )
}

export default function RuleModal({ rule, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 bg-pvsa-navy rounded-t-2xl shrink-0">
          <div>
            <p className="text-xs text-blue-300 font-medium uppercase tracking-widest mb-0.5">
              Estándar PVSA S.A.
            </p>
            <h3 className="text-white font-bold text-sm leading-tight">
              {rule.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors ml-4 mt-0.5 shrink-0"
            title="Cerrar (ESC)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 space-y-0.5">
          {rule.content.split('\n').map((line, i) => renderLine(line, i))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50 rounded-b-2xl shrink-0 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Puerto Ventanas S.A. — Documento normativo vigente
          </p>
          <button
            onClick={onClose}
            className="text-xs text-pvsa-blue hover:underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
