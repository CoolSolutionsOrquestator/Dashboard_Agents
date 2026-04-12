# Dashboard Agents - Documentación del Proyecto

## 📋 Historias de Usuario

| # | Como | Quiero | Para |
|---|------|--------|------|
| 1 | Dante | Ver un resumen general del sistema | Entender rápidamente qué está pasando |
| 2 | Dante | Ver el total estimado de tokens usados | Tener control del consumo |
| 3 | Dante | Ver el costo estimado total | Entender cuánto están gastando mis agentes |
| 4 | Dante | Ver el costo desagregado por agente | Identificar cuáles consumen más recursos |
| 5 | Dante | Ver qué modelo usa cada agente | Entender la distribución de modelos |
| 6 | Dante | Ver el estado de cada agente (activo, idle, error) | Saber en qué está cada uno |
| 7 | Dante | Ver la última actividad de cada agente | Tener contexto operativo básico |
| 8 | Dante | Filtrar información por agente o modelo | Enfocar el monitoreo |
| 9 | Dante | Datos mock simulados inicialmente | Prototipar sin datos reales |
| 10 | Dante + Nico | Página clara y presentable con varias vistas | Uso interno profesional |

## 🎯 Alcance del MVP

### Vista Dashboard (Home)
- Total de tokens
- Costo total estimado
- Cantidad de agentes
- Cantidad de agentes activos
- Resumen por modelo
- Alertas básicas

### Vista Agentes
- Nombre
- Estado (activo / idle / error)
- Modelo
- Tokens consumidos
- Costo estimado
- Última actividad

### Vista Costos
- Costo total
- Costo por agente
- Costo por modelo

## 🚫 Fuera del alcance (por ahora)
- Analítica avanzada
- Historial complejo
- Autenticación compleja
- Auditoría completa
- Trazabilidad entre agentes
- Calendarios / To-do lists
- Recomendaciones automáticas
- Visualizaciones complejas

## 📅 Plan de Sprints

### Sprint 1: Definición y Arquitectura ⬅️ ACTUAL
**Objetivo:** Planificación completa antes de escribir una línea de código.
- [ ] Definir estructura del proyecto
- [ ] Definir subagentes y responsabilidades
- [ ] Proponer stack tecnológico
- [ ] Definir modelo de datos mock
- [ ] Definir estructura de vistas (wireframe simple)
- **Entregable:** Sprint Review con Dante/Nico — NO avanzar sin validación

### Sprint 2: Base Técnica + Dashboard Inicial
**Objetivo:** Tener algo funcional corriendo en localhost.
- [ ] Levantar backend básico
- [ ] Levantar frontend básico
- [ ] Implementar datos mock
- [ ] Construir vista Dashboard funcional
- **Entregable:** Sprint Review mostrando dashboard funcionando

### Sprint 3: Vista de Agentes
**Objetivo:** Métricas por agente visibles y claras.
- [ ] Implementar vista de agentes
- [ ] Mostrar métricas por agente
- [ ] Integrar con dashboard
- **Entregable:** Sprint Review — validar claridad de la información

### Sprint 4: Vista de Costos
**Objetivo:** Control financiero claro.
- [ ] Implementar desglose de costos
- [ ] Costo por agente
- [ ] Costo por modelo
- **Entregable:** Sprint Review — validar que la info financiera sea clara

### Sprint 5: Filtros y Mejoras
**Objetivo:** MVP pulido y listo.
- [ ] Agregar filtros básicos (agente, modelo)
- [ ] Mejorar UI
- [ ] Limpiar y ordenar el sistema
- **Entregable:** Sprint Review final — evaluar siguientes pasos

---

## 🔄 Regla de Oro
- **Regla de Oro:** Ningún sprint avanza al siguiente sin Sprint Review aprobada por Dante o Nico.

## ✅ Sprint 1 - COMPLETADO (12 Abril 2026)
- Stack: React + Vite + TypeScript + Tailwind + shadcn/ui + Recharts
- Datos mock actualizados a modelos reales de Ollama Cloud
- Capa de abstracción dataService.ts para reemplazo futuro de API
- Aprobado por Nico con observaciones integradas