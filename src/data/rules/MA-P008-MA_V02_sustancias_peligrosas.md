# P-008-MA V_02 — Procedimiento de Sustancias Peligrosas (Medio Ambiente)
**Versión:** 02 | **Tipo:** MA — Procedimiento Ambiental  
**Aplica a:** Procedimientos y matrices MA con sustancias peligrosas  
**Triggers:** sustancia peligrosa, cloro, hipoclorito, solvente, pintura, ácido, producto químico, derrame, rombo, NCh 1411

---

## Reglas para el Procedimiento de Trabajo

| ID | Requisito | NC si... |
|----|-----------|----------|
| P008-R01 | Todos los envases de sustancias peligrosas deben llevar el **rombo de peligro conforme a NCh 1411/4** | El procedimiento usa sustancias peligrosas y no indica el rombo NCh 1411/4 en los envases |
| P008-R02 | Cada sustancia peligrosa debe identificarse con su **clase NCh 382** (ej.: Cloro = Clase 8 Corrosivo) | No se indica la clase NCh 382 de las sustancias peligrosas |
| P008-R03 | La HDS debe cumplir con **NCh 2245** | No se referencia NCh 2245 en la HDS o no se adjunta HDS |
| P008-R04 | Los envases vacíos de sustancias peligrosas deben disponerse como **residuos peligrosos** conforme a P-001-MA V_04 | No se indica la gestión de envases vacíos como residuo peligroso |
| P008-R05 | El procedimiento referencia explícitamente **P-008-MA V_02** en la sección de referencias | El procedimiento usa sustancias peligrosas y no referencia P-008-MA V_02 |

---

## Reglas para la Matriz Ambiental (MA)

| ID | Requisito | NC si... |
|----|-----------|----------|
| P008-M01 | El **derrame de cualquier sustancia peligrosa** (cloro, solvente, pintura, ácido, etc.) debe clasificarse como **"MUY SIGNIFICATIVO"** independientemente del valor calculado S = F × Se × L | El derrame de sustancia peligrosa está clasificado como "Significativo" en la matriz MA — esto es INCORRECTO según P-008-MA V_02 Sección 5, que lo fija como Muy Significativo sin excepción |
| P008-M02 | El aspecto ambiental "generación de residuos peligrosos" (envases vacíos) debe estar identificado en la matriz MA | No aparece el aspecto de residuos peligrosos por envases vacíos de sustancias peligrosas |
| P008-M03 | Los controles ambientales para el manejo de sustancias peligrosas incluyen: rombo NCh 1411/4, HDS disponible, gestión de envases como residuo peligroso | Los controles no incluyen los requisitos de P-008-MA V_02 |

---

## Regla Crítica — Clasificación Imperativa de Derrames

> **P-008-MA V_02, Sección 5 establece de forma EXPLÍCITA E IMPERATIVA:**  
> _"Derrames de Sustancias Peligrosas = MUY SIGNIFICATIVO"_  
>
> Esta clasificación **NO puede ser modificada** por el resultado de la fórmula S = F × Se × L.  
> Si la matriz MA calcula un valor ≤45 para el derrame de una sustancia peligrosa, el valor DEBE corregirse a "MUY SIGNIFICATIVO".
