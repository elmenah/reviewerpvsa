export default function ResultsTable({ results, tiposDetectados, onDownload, model }) {
  const { hallazgos = [] } = results
  const nc = hallazgos.filter(h => h.tipo === 'NC').length
  const obs = hallazgos.filter(h => h.tipo === 'OBS').length

  return (
    <div className="mt-8 space-y-4">

      {/* Summary bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-pvsa-navy">Resultado de la Revisión</h2>
          {tiposDetectados.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              Tipos detectados:&nbsp;
              {tiposDetectados.map(t => (
                <span key={t} className="inline-block bg-pvsa-light text-pvsa-navy text-xs font-medium px-2 py-0.5 rounded mr-1">
                  {t}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pvsa-red">{nc}</div>
            <div className="text-xs text-gray-500">No Conformidades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pvsa-orange">{obs}</div>
            <div className="text-xs text-gray-500">Observaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{hallazgos.length}</div>
            <div className="text-xs text-gray-500">Total hallazgos</div>
          </div>
          <button
            onClick={onDownload}
            className="btn-primary text-sm py-2 px-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar CSV
          </button>
        </div>
      </div>

      {/* Findings table */}
      {hallazgos.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-green-700">Sin hallazgos detectados</p>
          <p className="text-sm text-green-500 mt-1">El documento cumple con los criterios PVSA revisados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-pvsa-navy text-white">
                <th className="px-4 py-3 text-left w-20">N°</th>
                <th className="px-4 py-3 text-left w-20">Tipo</th>
                <th className="px-4 py-3 text-left">Descripción del Hallazgo</th>
                <th className="px-4 py-3 text-left w-44">Norma PVSA</th>
              </tr>
            </thead>
            <tbody>
              {hallazgos.map((h, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 ${h.tipo === 'NC' ? 'bg-red-50/40' : 'bg-orange-50/30'}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3">
                    {h.tipo === 'NC'
                      ? <span className="badge-nc">NC</span>
                      : <span className="badge-obs">OBS</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-700">{h.descripcion}</td>
                  <td className="px-4 py-3 text-pvsa-navy font-medium text-xs">{h.norma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Revisión basada exclusivamente en los estándares PVSA S.A. vigentes.
        Los hallazgos deben ser validados por el Departamento de Prevención de Riesgos.
        {model && (
          <span className="ml-2 inline-flex items-center gap-1">
            · Modelo usado:
            <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${
              model === 'gpt-4o' ? 'bg-pvsa-light text-pvsa-navy' : 'bg-green-100 text-green-700'
            }`}>
              {model}
            </span>
          </span>
        )}
      </p>
    </div>
  )
}
