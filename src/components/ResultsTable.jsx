import { useState } from 'react'
import { findRule } from '../lib/ruleSearch.js'
import RuleModal from './RuleModal.jsx'

const ABSENT = '(No encontrado en el documento)'

export default function ResultsTable({ results, tiposDetectados, onDownload, model }) {
  const { hallazgos = [] } = results
  const nc = hallazgos.filter(h => h.tipo === 'NC').length
  const obs = hallazgos.filter(h => h.tipo === 'OBS').length

  const [selectedRule, setSelectedRule] = useState(null)

  function handleNormaClick(norma) {
    const rule = findRule(norma)
    if (rule) setSelectedRule(rule)
  }

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
                <th className="px-4 py-3 text-left w-12">N°</th>
                <th className="px-4 py-3 text-left w-20">Tipo</th>
                <th className="px-4 py-3 text-left">Descripción del Hallazgo</th>
                <th className="px-4 py-3 text-left w-44">
                  Norma PVSA
                  <span className="block text-xs font-normal text-blue-200 leading-tight">
                    clic para ver extracto
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {hallazgos.map((h, i) => {
                const hasRule = !!findRule(h.norma)
                const citaAusente = !h.cita || h.cita === ABSENT
                return (
                  <tr
                    key={i}
                    className={`border-t border-gray-100 ${h.tipo === 'NC' ? 'bg-red-50/40' : 'bg-orange-50/30'}`}
                  >
                    {/* N° */}
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 align-top">
                      {String(i + 1).padStart(2, '0')}
                    </td>

                    {/* Tipo */}
                    <td className="px-4 py-3 align-top">
                      {h.tipo === 'NC'
                        ? <span className="badge-nc">NC</span>
                        : <span className="badge-obs">OBS</span>
                      }
                    </td>

                    {/* Descripción + cita */}
                    <td className="px-4 py-3 text-gray-700 align-top">
                      <p className="leading-snug">{h.descripcion}</p>
                      {h.cita && (
                        citaAusente ? (
                          <p className="mt-1.5 text-xs italic text-gray-400 flex items-center gap-1">
                            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            No encontrado en el documento
                          </p>
                        ) : (
                          <blockquote className="mt-1.5 border-l-4 border-gray-300 pl-2 text-xs text-gray-500 italic leading-snug">
                            "{h.cita}"
                          </blockquote>
                        )
                      )}
                    </td>

                    {/* Norma — clickable if we have the rule */}
                    <td className="px-4 py-3 align-top">
                      {hasRule ? (
                        <button
                          onClick={() => handleNormaClick(h.norma)}
                          className="text-pvsa-navy font-medium text-xs hover:text-pvsa-blue hover:underline flex items-center gap-1 group text-left"
                          title="Ver extracto de la norma PVSA"
                        >
                          <span>{h.norma}</span>
                          <svg className="w-3 h-3 text-gray-400 group-hover:text-pvsa-blue shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-pvsa-navy font-medium text-xs">{h.norma}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
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

      {/* Rule modal */}
      {selectedRule && (
        <RuleModal rule={selectedRule} onClose={() => setSelectedRule(null)} />
      )}
    </div>
  )
}
