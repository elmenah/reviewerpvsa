# E-001-PR V_13 — Identificación de Peligros y Evaluación de Riesgos de SST
**Versión:** 13 | **Tipo:** SSO — Metodología de Evaluación de Riesgos  
**Aplica a:** Toda matriz SSO de empresa contratista  
**Triggers:** matriz SSO, evaluación de riesgos, peligros, VEP, INTOLERABLE, controles

---

## Metodología de Evaluación (VEP)

**VEP = Probabilidad (P) × Consecuencia (C)**

| Nivel de Riesgo | Descripción | Acción requerida |
|----------------|-------------|-----------------|
| ACEPTABLE | VEP bajo | Sin acción inmediata |
| MODERADO | VEP medio | Mejoras progresivas |
| IMPORTANTE | VEP alto | Requiere controles a corto plazo |
| **INTOLERABLE** | **VEP máximo** | **Controles INMEDIATOS antes de iniciar. Si no se puede reducir → SUSPENDER el trabajo** |

---

## Reglas para la Matriz SSO

| ID | Requisito | NC si... |
|----|-----------|----------|
| E001-R01 | Todo peligro significativo de la actividad debe estar identificado en la matriz | Hay peligros evidentes de la actividad (ej: chispas de esmeril, vapores de cloro) que no aparecen identificados |
| E001-R02 | La evaluación de riesgos sigue la metodología VEP (P × C) con los niveles: Aceptable / Moderado / Importante / Intolerable | La metodología de evaluación no corresponde a VEP o los niveles son distintos |
| E001-R03 | Para riesgos **INTOLERABLES**: se describen controles concretos que efectivamente reducen el riesgo a nivel tolerable ANTES de iniciar la tarea | Un riesgo INTOLERABLE tiene controles genéricos (ej: solo "EPP", "capacitación") que no reducen el riesgo |
| E001-R04 | Para riesgos **INTOLERABLES** en espacios cerrados con agentes químicos (ej: vapores de cloro): los controles de ingeniería (ventilación forzada, extracción) deben aparecer explícitamente como primer nivel de control | Riesgo INTOLERABLE por exposición química sin control de ingeniería (ventilación) |
| E001-R05 | La jerarquía de controles se respeta: Eliminar → Control ingenieril → Control organizacional → EPP | El EPP aparece como único o primer control sin controles de ingeniería previos |
| E001-R06 | El formato de la matriz corresponde al entregado por PVSA (R1-P-012-PEM / base DS44) | El formato no es el PVSA |
| E001-R07 | Los estándares PVSA aplicables (E-005-PR, E-006-PR, E-010-PR, etc.) aparecen referenciados en los controles específicos de cada riesgo crítico | Los estándares PVSA no aparecen en la columna de controles |
| E001-R08 | La evaluación de riesgos higiénicos se realiza conforme a informes higiénicos del agente (o se declara la limitación) | No hay evaluación higiénica para agentes químicos presentes en la actividad |
