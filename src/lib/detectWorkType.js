const KEYWORDS = {
  caliente: [
    'esmeril', 'amoladora', 'esmerilado', 'soldadura', 'soldar', 'oxicorte',
    'plasma', 'trabajo en caliente', 'trabajos en caliente', 'disco de corte',
    'arco electrico', 'arco eléctrico', 'mig', 'tig', 'electrodo', 'chispas',
  ],
  altura: [
    'altura', 'techumbre', 'techo', 'andamio', 'manlift', 'escalera', 'escala',
    'plataforma elevada', 'trabajo en altura', 'trabajos en altura',
    '1.5 m', '1,5 m', 'caida', 'caída', 'arnes', 'arnés',
  ],
  andamio: [
    'andamio', 'andamios', 'scaffolding', 'layher',
    'tarjeta verde', 'tarjeta roja',
  ],
  sustancias: [
    'cloro', 'hipoclorito', 'solvente', 'pintura', 'acido', 'ácido',
    'sustancia peligrosa', 'producto quimico', 'producto químico',
    'hds', 'hoja de datos', 'epóxico', 'epoxico', 'thinner',
    'desengrasante', 'quimico', 'químico', 'limpiador',
  ],
  espacioConfinado: [
    'espacio confinado', 'cisterna', 'silo', 'camara', 'cámara',
    'tanque', 'ducto', 'atmosfera', 'medicion de gases',
  ],
  izaje: [
    'grua', 'grúa', 'izaje', 'izar', 'plan de izaje', 'rigger',
    'eslinga', 'estrobos', 'grillete', 'pluma', 'horquilla',
  ],
}

export function detectWorkTypes(text) {
  const lower = text.toLowerCase()
  const detected = {}
  for (const [type, keywords] of Object.entries(KEYWORDS)) {
    detected[type] = keywords.some(kw => lower.includes(kw))
  }
  return detected
}

export function summarizeDetected(types) {
  const labels = {
    caliente:        'Trabajo en Caliente',
    altura:          'Trabajo en Altura',
    andamio:         'Uso de Andamios',
    sustancias:      'Sustancias Peligrosas',
    espacioConfinado:'Espacio Confinado',
    izaje:           'Maniobras de Izaje',
  }
  return Object.entries(types)
    .filter(([, v]) => v)
    .map(([k]) => labels[k] || k)
}
