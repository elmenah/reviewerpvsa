import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

/**
 * Extracts plain text from an uploaded File object.
 * Supports: .docx, .xlsx, .xls, .pdf (basic)
 */
export async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'docx') return extractDocx(file)
  if (ext === 'xlsx' || ext === 'xls' || ext === 'xlsm') return extractXlsx(file)
  if (ext === 'pdf') return extractPdf(file)
  if (ext === 'txt') return file.text()

  throw new Error(`Formato no soportado: .${ext}`)
}

async function extractDocx(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}

async function extractXlsx(file) {
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })
  const lines = []
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(ws, { blankrows: false })
    if (csv.trim()) {
      lines.push(`\n## Hoja: ${sheetName}\n${csv}`)
    }
  }
  return lines.join('\n')
}

async function extractPdf(file) {
  // Basic PDF: read as text (works for text-based PDFs via FileReader)
  // For full OCR, would need pdf.js — this covers most contractor PDFs
  try {
    const text = await file.text()
    // Strip binary garbage, keep printable chars
    return text.replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, ' ').replace(/ {3,}/g, ' ')
  } catch {
    throw new Error('No se pudo leer el PDF. Intenta convertirlo a .docx primero.')
  }
}
