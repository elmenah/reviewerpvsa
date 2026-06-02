import d005 from '../data/rules/ADM-D005-PR_V01_criterios_procedimientos.md?raw'
import d004 from '../data/rules/ADM-D004-PR_V021_reglamento_contratistas.md?raw'
import e001 from '../data/rules/SSO-E001-PR_V13_evaluacion_riesgos.md?raw'
import i001 from '../data/rules/SSO-I001-PR_V02_permiso_trabajo_safex.md?raw'
import r007 from '../data/rules/SSO-R007-PR_V07_formulario_permiso.md?raw'
import p002ma from '../data/rules/MA-P002-MA_V013_aspectos_impactos.md?raw'
import e006 from '../data/rules/SSO-E006-PR_V12_trabajos_caliente.md?raw'
import e005 from '../data/rules/SSO-E005-PR_V08_altura_fisica.md?raw'
import e010 from '../data/rules/SSO-E010-PR_V04_andamios.md?raw'
import p010 from '../data/rules/SSO-P010-PEM_sustancias_peligrosas.md?raw'
import p008ma from '../data/rules/MA-P008-MA_V02_sustancias_peligrosas.md?raw'
import p001ma from '../data/rules/MA-P001-MA_V04_residuos_solidos.md?raw'

const RULES_MAP = [
  { keys: ['E-006', 'E006'], content: e006, title: 'E-006-PR V12 — Trabajos en Caliente' },
  { keys: ['E-005', 'E005'], content: e005, title: 'E-005-PR V08 — Trabajos en Altura' },
  { keys: ['E-010', 'E010'], content: e010, title: 'E-010-PR V04 — Andamios' },
  { keys: ['E-001', 'E001'], content: e001, title: 'E-001-PR V13 — Evaluación de Riesgos' },
  { keys: ['I-001', 'I001'], content: i001, title: 'I-001-PR V02 — Permiso de Trabajo SAFEX' },
  { keys: ['R-007', 'R007'], content: r007, title: 'R-007-PR V07 — Formulario Permiso de Trabajo' },
  { keys: ['P-010', 'P010'], content: p010, title: 'P-010-PEM — Sustancias Peligrosas (SSO)' },
  { keys: ['P-008', 'P008'], content: p008ma, title: 'P-008-MA V02 — Sustancias Peligrosas (MA)' },
  { keys: ['P-001', 'P001'], content: p001ma, title: 'P-001-MA V04 — Residuos Sólidos' },
  { keys: ['P-002', 'P002'], content: p002ma, title: 'P-002-MA V013 — Aspectos e Impactos Ambientales' },
  { keys: ['D-005', 'D005', 'ADM-D005'], content: d005, title: 'D-005-PR V01 — Criterios de Procedimientos' },
  { keys: ['D-004', 'D004', 'ADM-D004'], content: d004, title: 'D-004-PR V021 — Reglamento de Contratistas' },
]

/**
 * Given a norma code string (e.g. "E-006-PR V12"), returns the matching
 * { title, content } object, or null if not found.
 */
export function findRule(normaCode) {
  if (!normaCode) return null
  const upper = normaCode.toUpperCase()
  return RULES_MAP.find(r => r.keys.some(k => upper.includes(k.toUpperCase()))) || null
}
