// Import all rule files as raw strings (bundled at build time by Vite)
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

/**
 * Returns the relevant rule blocks as a single string
 * based on detected work types.
 */
export function loadRules(workTypes) {
  const blocks = []

  // Always loaded
  blocks.push(d005)
  blocks.push(d004)
  blocks.push(i001)
  blocks.push(r007)
  blocks.push(e001)
  blocks.push(p002ma)

  if (workTypes.caliente)        blocks.push(e006)
  if (workTypes.altura)          blocks.push(e005)
  if (workTypes.andamio)         blocks.push(e010)
  if (workTypes.sustancias) {
    blocks.push(p010)
    blocks.push(p008ma)
    blocks.push(p001ma)
  }

  return blocks.join('\n\n---\n\n')
}
