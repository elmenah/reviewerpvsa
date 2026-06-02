import { useRef, useState } from 'react'

const ACCEPT = '.docx,.xlsx,.xls,.xlsm,.pdf,.txt'

const ICONS = {
  procedure: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  sso: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  ma: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
    </svg>
  ),
}

export default function DropZone({ label, sublabel, fileKey, file, onFile, icon = 'procedure' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(fileKey, f)
  }

  function handleChange(e) {
    const f = e.target.files[0]
    if (f) onFile(fileKey, f)
  }

  const zoneClass = [
    'drop-zone',
    dragging ? 'active' : '',
    file ? 'has-file' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={zoneClass}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleChange}
      />

      <div className={`flex flex-col items-center gap-2 ${file ? 'text-pvsa-navy' : 'text-gray-400'}`}>
        {ICONS[icon]}

        {file ? (
          <>
            <p className="font-semibold text-pvsa-navy text-sm">{file.name}</p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024).toFixed(0)} KB — clic para cambiar
            </p>
            <button
              className="mt-1 text-xs text-pvsa-red hover:underline"
              onClick={e => { e.stopPropagation(); onFile(fileKey, null) }}
            >
              Quitar archivo
            </button>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-600">{label}</p>
            <p className="text-xs text-gray-400">{sublabel}</p>
            <p className="text-xs text-gray-300 mt-1">
              .docx · .xlsx · .pdf — arrastra o haz clic
            </p>
          </>
        )}
      </div>
    </div>
  )
}
