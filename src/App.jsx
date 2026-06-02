import { useState } from 'react'
import Header from './components/Header.jsx'
import DropZone from './components/DropZone.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import Spinner from './components/Spinner.jsx'
import { extractText } from './lib/extractText.js'
import { detectWorkTypes, summarizeDetected } from './lib/detectWorkType.js'
import { loadRules } from './lib/loadRules.js'

const INITIAL_FILES = { procedimiento: null, matrizSSO: null, matrizMA: null }

const MODELS = [
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    badge: 'Recomendado',
    badgeColor: 'bg-pvsa-navy text-white',
    cost: '~$0,05 / revisión',
    desc: 'Máxima precisión en análisis de cumplimiento normativo',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    badge: 'Económico',
    badgeColor: 'bg-green-100 text-green-700',
    cost: '~$0,003 / revisión',
    desc: 'Más rápido y barato. Puede omitir hallazgos complejos',
  },
]

export default function App() {
  const [files, setFiles] = useState(INITIAL_FILES)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [tiposDetectados, setTiposDetectados] = useState([])
  const [error, setError] = useState(null)
  const [empresa, setEmpresa] = useState('')
  const [model, setModel] = useState('gpt-4o')
  const [contexto, setContexto] = useState('')

  function handleFile(key, file) {
    setFiles(prev => ({ ...prev, [key]: file }))
    setResults(null)
    setError(null)
  }

  async function handleReview() {
    if (!files.procedimiento) return
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // 1. Extract text from each uploaded file
      const textos = {}
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          textos[key] = await extractText(file)
        }
      }

      // 2. Detect work types from all extracted text
      const allText = Object.values(textos).join('\n')
      const workTypes = detectWorkTypes(allText)
      const detected = summarizeDetected(workTypes)
      setTiposDetectados(detected)

      // 3. Load relevant PVSA rules
      const reglas = loadRules(workTypes)

      // 4. Call the Netlify Function (or local dev endpoint)
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textos, reglas, empresa, model, contexto }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `Error ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDownloadCSV() {
    if (!results?.hallazgos) return
    const rows = [
      ['N°', 'Tipo', 'Descripción', 'Norma PVSA'],
      ...results.hallazgos.map((h, i) => [i + 1, h.tipo, h.descripcion, h.norma]),
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revision-pvsa-${empresa || 'eecc'}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const canReview = !!files.procedimiento && !loading

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">

        {/* Company name field */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label className="block text-sm font-semibold text-pvsa-navy mb-2">
            Empresa Contratista (opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: DAIG Spa"
            value={empresa}
            onChange={e => setEmpresa(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-pvsa-blue focus:border-transparent"
          />
        </div>

        {/* Context / notes field */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <label className="block text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contexto adicional para la revisión (opcional)
          </label>
          <p className="text-xs text-amber-600 mb-2">
            Indica aquí si hay requisitos de formato ya aprobados por PVSA, excepciones conocidas o
            cualquier contexto que el revisor deba considerar. Los requisitos técnicos de seguridad
            siempre se evalúan con rigor.
          </p>
          <textarea
            rows={3}
            placeholder={
              'Ej: "El formato del procedimiento ha sido aprobado por la prevencionista. ' +
              'No requieren paso a paso explícito ni sección separada de charla de 5 min. ' +
              'Sí se menciona la charla dentro del texto del procedimiento."'
            }
            value={contexto}
            onChange={e => setContexto(e.target.value)}
            className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                       placeholder:text-gray-300 resize-none"
          />
        </div>

        {/* Upload section */}
        <div>
          <h2 className="text-base font-semibold text-pvsa-navy mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-pvsa-navy text-white rounded-full text-xs flex items-center justify-center">1</span>
            Cargar documentos del contratista
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DropZone
              label="Procedimiento de Trabajo"
              sublabel="PTS / Procedimiento principal"
              fileKey="procedimiento"
              file={files.procedimiento}
              onFile={handleFile}
              icon="procedure"
            />
            <DropZone
              label="Matriz SSO"
              sublabel="Identificación de peligros y riesgos"
              fileKey="matrizSSO"
              file={files.matrizSSO}
              onFile={handleFile}
              icon="sso"
            />
            <DropZone
              label="Matriz Ambiental (MA)"
              sublabel="Aspectos e impactos ambientales"
              fileKey="matrizMA"
              file={files.matrizMA}
              onFile={handleFile}
              icon="ma"
            />
          </div>
          {!files.procedimiento && (
            <p className="text-xs text-gray-400 mt-2">
              * El Procedimiento de Trabajo es obligatorio. Las matrices son opcionales.
            </p>
          )}
        </div>

        {/* Model selector */}
        <div>
          <h2 className="text-base font-semibold text-pvsa-navy mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-pvsa-navy text-white rounded-full text-xs flex items-center justify-center">2</span>
            Seleccionar modelo de IA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  model === m.id
                    ? 'border-pvsa-navy bg-pvsa-light/40 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-pvsa-blue/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-pvsa-navy text-sm">{m.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{m.desc}</p>
                <p className="text-xs font-semibold text-pvsa-blue">{m.cost}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Review button */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-base font-semibold text-pvsa-navy mb-1 flex items-center gap-2">
              <span className="w-6 h-6 bg-pvsa-navy text-white rounded-full text-xs flex items-center justify-center">3</span>
              Revisar contra normas PVSA
            </h2>
            <p className="text-xs text-gray-400 ml-8">
              El sistema detectará el tipo de trabajo y cargará solo las normas relevantes
            </p>
          </div>
          <button
            onClick={handleReview}
            disabled={!canReview}
            className="btn-primary ml-auto"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Analizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Revisar documentos
              </>
            )}
          </button>
        </div>

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-pvsa-red mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-pvsa-red text-sm">Error al analizar</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              {error.includes('API') && (
                <p className="text-xs text-gray-500 mt-2">
                  Asegúrate de que <code className="bg-gray-100 px-1 rounded">OPENAI_API_KEY</code> está configurada en el archivo <code className="bg-gray-100 px-1 rounded">.env.local</code>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <ResultsTable
            results={results}
            tiposDetectados={tiposDetectados}
            onDownload={handleDownloadCSV}
            model={model}
          />
        )}
      </main>

      <footer className="text-center py-4 text-xs text-gray-300 border-t">
        Puerto Ventanas S.A. — Sistema de Revisión EECC · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
