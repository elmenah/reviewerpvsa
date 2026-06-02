const OpenAI = require('openai')

const SYSTEM_PROMPT = `Eres un revisor especializado en Seguridad, Salud Ocupacional y Medio Ambiente de Puerto Ventanas S.A. (PVSA).

Tu tarea es revisar procedimientos de trabajo y matrices SSO/MA de empresas contratistas contra las normas PVSA que se te entregan.

REGLAS ESTRICTAS:
1. SOLO reporta hallazgos que estén directamente sustentados en las reglas PVSA entregadas.
2. NO inventes normas, NO uses conocimiento general de seguridad que no esté en las reglas.
3. Si una regla no aplica al documento revisado, NO la reportes.
4. Distingue entre NC (incumplimiento directo, claro) y OBS (omisión, ambigüedad o mejora necesaria).
5. Sé específico: describe QUÉ falta o está mal, no solo que "no cumple".
6. Responde ÚNICAMENTE con JSON válido, sin texto adicional.

FORMATO DE RESPUESTA:
{
  "hallazgos": [
    {
      "tipo": "NC" | "OBS",
      "descripcion": "Descripción clara y específica del hallazgo, indicando qué dice el documento y qué debería decir según la norma PVSA.",
      "norma": "Código de la norma PVSA (ej: E-006-PR V12)"
    }
  ]
}`

function buildUserPrompt(textos, reglas, empresa) {
  const partes = []

  if (empresa) {
    partes.push(`## EMPRESA CONTRATISTA: ${empresa}\n`)
  }

  if (textos.procedimiento) {
    partes.push(`## DOCUMENTO 1: PROCEDIMIENTO DE TRABAJO\n\n${textos.procedimiento.slice(0, 8000)}`)
  }
  if (textos.matrizSSO) {
    partes.push(`## DOCUMENTO 2: MATRIZ SSO\n\n${textos.matrizSSO.slice(0, 5000)}`)
  }
  if (textos.matrizMA) {
    partes.push(`## DOCUMENTO 3: MATRIZ AMBIENTAL (MA)\n\n${textos.matrizMA.slice(0, 5000)}`)
  }

  partes.push(`## NORMAS PVSA APLICABLES\n\n${reglas}`)

  partes.push(`## INSTRUCCIÓN\nRevisa TODOS los documentos anteriores contra las normas PVSA entregadas. Reporta cada hallazgo con tipo (NC u OBS), descripción específica y la norma PVSA que lo sustenta. Responde solo con JSON válido.`)

  return partes.join('\n\n---\n\n')
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OPENAI_API_KEY no está configurada. Agrégala en .env.local o en Netlify Environment Variables.' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Request body inválido' }) }
  }

  const { textos, reglas, empresa = '', model = 'gpt-4o' } = body
  if (!textos?.procedimiento) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Se requiere al menos el texto del procedimiento' }) }
  }

  const ALLOWED_MODELS = ['gpt-4o', 'gpt-4o-mini']
  const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'gpt-4o'

  try {
    const client = new OpenAI({ apiKey })

    const completion = await client.chat.completions.create({
      model: selectedModel,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(textos, reglas, empresa) },
      ],
    })

    const raw = completion.choices[0].message.content
    const parsed = JSON.parse(raw)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    }
  } catch (err) {
    console.error('OpenAI error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error al llamar a OpenAI' }),
    }
  }
}
