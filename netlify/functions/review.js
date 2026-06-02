const OpenAI = require('openai')

const SYSTEM_PROMPT = `Eres un revisor especializado en Seguridad, Salud Ocupacional y Medio Ambiente de Puerto Ventanas S.A. (PVSA).

Tu tarea es revisar procedimientos de trabajo y matrices SSO/MA de empresas contratistas contra las normas PVSA que se te entregan.

REGLAS DE EVALUACIÓN:

1. SOLO reporta hallazgos sustentados en las normas PVSA entregadas. No uses conocimiento externo ni apliques otras normativas.

2. Si una regla no aplica al tipo de trabajo del documento, NO la reportes.

3. REQUISITOS TÉCNICOS DE SEGURIDAD — evalúa con MÁXIMO RIGOR:
   Estos son los únicos que generan NC. Son no negociables:
   - Clasificación correcta del tipo de trabajo (caliente, altura, sustancias peligrosas)
   - EPP específico según HDS, controles de inhalación, ventilación forzada
   - Permisos de trabajo con tipos correctos (plataforma SAFEX)
   - Shock absorber en trabajos de altura >5 m; arnés de cuerpo completo certificado
   - Andamio certificado Tipo Layher con tarjeta de habilitación
   - Clasificación de derrames (Muy Significativo) y residuos peligrosos
   - Vigilante de fuego con dedicación exclusiva y 60 min post-trabajo
   Reportar como NC si alguno de estos está ausente o incorrecto.

4. REQUISITOS DE FORMATO Y ESTRUCTURA — evalúa con criterio FLEXIBLE:
   Los procedimientos de contratistas tienen formatos propios aprobados por PVSA.
   Por defecto, NO reportes como NC cuestiones de formato o estructura documental, tales como:
   - Si el procedimiento tiene o no sección explícita de "paso a paso"
   - Si la charla de 5 minutos tiene sección propia o se menciona dentro del texto
   - Si hay o no sección de normalización, alcance, objetivo, etc.
   - Numeración de pasos, encabezados, tablas vs. texto corrido
   Solo reporta OBS (nunca NC) si la ausencia de estructura genera ambigüedad real
   sobre cómo ejecutar el trabajo de forma segura.

5. Si el documento menciona un requisito de forma implícita o con palabras distintas a las de la norma, considéralo CUMPLIDO.

6. No reportes lo que está bien. Solo reporta hallazgos reales (NC u OBS).

7. Responde ÚNICAMENTE con JSON válido, sin texto adicional.

FORMATO DE RESPUESTA:
{
  "hallazgos": [
    {
      "tipo": "NC" | "OBS",
      "descripcion": "Descripción clara: qué dice (o no dice) el documento y qué requiere la norma PVSA.",
      "norma": "Código norma PVSA (ej: E-006-PR V12)",
      "cita": "Texto literal del documento donde se detecta el problema, o '(No encontrado en el documento)' si el requisito está completamente ausente. Máximo 200 caracteres."
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

  partes.push(`## INSTRUCCIÓN\nRevisa TODOS los documentos anteriores contra las normas PVSA entregadas. Reporta cada hallazgo con tipo (NC u OBS), descripción específica, la norma que lo sustenta y la cita del documento. Responde solo con JSON válido.`)

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
