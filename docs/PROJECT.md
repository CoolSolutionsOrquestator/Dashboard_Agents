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
| 11 | Dante | Tablero Kanban (Pendiente/En Progreso/Completado) | Mover historias y visualizar avance del sprint |
| 12 | Dante | Disparar acciones desde el dashboard | Activar flujo operativo de agentes manualmente |
| 13 | Dante | Vista "Grafo de Interacción" | Ver líneas de comunicación Orquestador→PM→Subagentes |
| 14 | Nico | Rastro de mensajes (logs de chat) | Entender por qué se tomó una decisión técnica |
| 15 | Equipo CS | Sistema preparado para producción (Cloud) | Conectar datos reales de OpenClaw |

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

### Vista Kanban (Nueva)
- Columnas: Pendiente, En Progreso, Completado
- Drag & Drop de historias de usuario
- % de completitud del proyecto

### Vista Agent Flow (Nueva)
- Grafo/diagrama de interacción entre agentes
- Orquestador → PM → Subagentes
- Burbujas de estado (agente escribiendo = brilla)
- Rastro de mensajes (logs de chat simplificados)

## 📅 Plan de Sprints

### Sprint 1: Definición y Arquitectura ✅ COMPLETADO
### Sprint 2: Base Técnica + Dashboard Inicial ✅ COMPLETADO
### Sprint 3: Vista de Agentes ✅ COMPLETADO
### Sprint 4: Vista de Costos ✅ COMPLETADO
### Sprint 5: Filtros y Mejoras ✅ COMPLETADO

### Sprint 6: Gestión de Sprints (Kanban Board) ⬅️ ACTUAL
**Objetivo:** Crear la funcionalidad de gestión de tareas interna.
- [ ] Implementar componente de Tablero Kanban
- [ ] Lógica de Drag & Drop para mover historias entre estados
- [ ] Integrar con resumen general (% de completitud del proyecto)
- **Entregable:** Sprint Review — validar fluidez del tablero y estados

### Sprint 7: Mapa de Interacción (Agent Flow)
**Objetivo:** Visualizar el "sistema nervioso" de la agencia.
- [ ] Crear vista de Interacción
- [ ] Implementar grafo/diagrama: Orquestador → PM → Subagentes
- [ ] Mostrar burbujas de estado en el grafo (agente escribiendo = brilla)
- **Entregable:** Sprint Review — verificar si el mapa permite entender quién habla con quién

### Sprint 8: Control de Acciones y Deploy a Producción
**Objetivo:** Pasar del mockup a la herramienta operativa.
- [ ] Añadir botón "Disparar Acción" (Trigger) para iniciar procesos OpenClaw
- [ ] Configuración de variables de entorno para producción
- [ ] Preparar contenedor Docker o script deploy (Vercel/DigitalOcean)
- [ ] Conexión preparada para API real de OpenClaw
- **Entregable:** Sprint Review Final — MVP listo para producción

---

## 🔄 Regla de Oro
- **Ningún sprint avanza al siguiente sin Sprint Review aprobada por Dante o Nico.**

## ✅ Sprints Completados
- **Sprint 1** (12 Abril): Stack, modelo datos, wireframes
- **Sprint 2** (12 Abril): Base técnica + Dashboard funcional
- **Sprint 3** (12 Abril): Vista de Agentes con filtros y ordenamiento
- **Sprint 4** (12 Abril): Vista de Costos con gráficos y desglose
- **Sprint 5** (12 Abril): Filtros globales, alertas, pulido UI