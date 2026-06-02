# ÍNDICE DE REGLAS PVSA — Base de Conocimiento para Revisión de Procedimientos
**Puerto Ventanas S.A. | Sistema Integrado de Gestión**  
**Versión:** 1.0 | Mayo 2026

---

## Estructura de Archivos

| Archivo | Norma PVSA | Tipo |
|---------|-----------|------|
| `ADM-D004-PR_V021_reglamento_contratistas.md` | D-004-PR V021 | Administrativo |
| `ADM-D005-PR_V01_criterios_procedimientos.md` | D-005-PR V_01 | Administrativo |
| `SSO-E001-PR_V13_evaluacion_riesgos.md` | E-001-PR V_13 | SSO — Metodología |
| `SSO-E005-PR_V08_altura_fisica.md` | E-005-PR V_08 | SSO — Riesgo Crítico |
| `SSO-E006-PR_V12_trabajos_caliente.md` | E-006-PR V12 | SSO — Riesgo Crítico |
| `SSO-E010-PR_V04_andamios.md` | E-010-PR V_04 | SSO — Riesgo Crítico |
| `SSO-I001-PR_V02_permiso_trabajo_safex.md` | I-001-PR V_02 | SSO — Instructivo |
| `SSO-P010-PEM_sustancias_peligrosas.md` | P-010-PEM | SSO — Procedimiento |
| `SSO-R007-PR_V07_formulario_permiso.md` | R-007-PR V_07 | SSO — Registro |
| `MA-P001-MA_V04_residuos_solidos.md` | P-001-MA V_04 | MA — Procedimiento |
| `MA-P002-MA_V013_aspectos_impactos.md` | P-002-MA V_013 | MA — Metodología |
| `MA-P008-MA_V02_sustancias_peligrosas.md` | P-008-MA V_02 | MA — Procedimiento |

---

## MAPA DE CARGA: Tipo de Trabajo → Archivos de Reglas

El sistema debe cargar SOLO los archivos relevantes para el tipo de trabajo detectado.

### 1. Siempre cargar (aplica a CUALQUIER procedimiento PVSA)
```
ADM-D005-PR_V01_criterios_procedimientos.md
ADM-D004-PR_V021_reglamento_contratistas.md
SSO-I001-PR_V02_permiso_trabajo_safex.md
SSO-R007-PR_V07_formulario_permiso.md
SSO-E001-PR_V13_evaluacion_riesgos.md     ← para la Matriz SSO
MA-P002-MA_V013_aspectos_impactos.md       ← para la Matriz MA
```

### 2. Cargar si se detectan palabras clave de TRABAJO EN CALIENTE
**Keywords:** `esmeril`, `amoladora`, `esmerilado`, `soldadura`, `oxicorte`, `plasma`, `corte`, `chispas`, `trabajo en caliente`, `caliente`
```
SSO-E006-PR_V12_trabajos_caliente.md
```

### 3. Cargar si se detectan palabras clave de TRABAJO EN ALTURA
**Keywords:** `altura`, `techumbre`, `techo`, `andamio`, `andamios`, `manlift`, `escala`, `escalera`, `plataforma elevada`, `trabajo en altura`, `1.5 m`, `1,5 m`, `metro de altura`
```
SSO-E005-PR_V08_altura_fisica.md
```

### 4. Cargar si se detectan palabras clave de ANDAMIOS
**Keywords:** `andamio`, `andamios`, `scaffolding`, `Layher`  
*(Carga adicional a la sección de altura)*
```
SSO-E010-PR_V04_andamios.md
```

### 5. Cargar si se detectan palabras clave de SUSTANCIAS PELIGROSAS (SSO)
**Keywords:** `cloro`, `hipoclorito`, `solvente`, `pintura`, `ácido`, `producto químico`, `sustancia peligrosa`, `HDS`, `hoja de datos`, `epóxico`, `químico`
```
SSO-P010-PEM_sustancias_peligrosas.md
```

### 6. Cargar si se detectan palabras clave de SUSTANCIAS PELIGROSAS (MA)
**Keywords:** `cloro`, `hipoclorito`, `solvente`, `pintura`, `ácido`, `producto químico`, `sustancia peligrosa`, `derrame`, `rombo`, `NCh 1411`, `envase`  
*(Siempre acompaña al punto 5 cuando hay matriz MA)*
```
MA-P008-MA_V02_sustancias_peligrosas.md
MA-P001-MA_V04_residuos_solidos.md
```

---

## Tabla de Combinaciones Típicas

| Tipo de trabajo | Archivos BASE | Archivos ADICIONALES |
|----------------|--------------|---------------------|
| Limpieza con productos químicos | BASE (6 archivos) | P010-PEM, P008-MA, P001-MA |
| Instalación / mantención en altura con andamio | BASE (6 archivos) | E005-PR, E010-PR |
| Trabajo con esmeril o soldadura | BASE (6 archivos) | E006-PR |
| Trabajo en altura + caliente + sustancias | BASE (6 archivos) | E005-PR, E006-PR, E010-PR, P010-PEM, P008-MA, P001-MA |

---

## Instrucciones para el Sistema de IA

```
SISTEMA DE REVISIÓN:
1. Leer el texto del procedimiento/matriz del contratista
2. Detectar keywords del mapa de carga
3. Cargar archivos BASE + archivos adicionales que correspondan
4. Para CADA regla de los archivos cargados:
   a. Buscar evidencia en el documento del contratista
   b. Si la condición de activación se cumple Y el requisito no está:
      → Reportar como NC con el ID de regla y norma PVSA de referencia
5. Generar informe con:
   - Hallazgos: ID, Tipo (NC/OBS), Descripción, Norma PVSA
   - Solo hallazgos con base en las reglas cargadas
   - No inventar hallazgos fuera de las reglas PVSA
```

---

## Tokens estimados por revisión (Opción B)

| Escenario | Archivos cargados | Tokens aprox. |
|-----------|------------------|---------------|
| Solo limpieza (sin altura ni caliente) | 6 BASE + 3 MA/SSO | ~4.000 |
| Altura + andamio | 6 BASE + 2 SSO | ~3.500 |
| Trabajo en caliente + altura + sustancias | 6 BASE + 6 adicionales | ~7.000 |
| Peor caso (todos los módulos) | 12 archivos | ~9.000 |
