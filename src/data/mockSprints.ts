// Dashboard Agents - Mock Sprint / Kanban Data
// 15 historias de usuario del proyecto + extras para sprints futuros

import type { Story } from '../types';

export const mockStories: Story[] = [
  // Sprint 1 - Definición y Arquitectura (completado)
  {
    id: 'HU-1',
    title: 'Ver un resumen general del sistema',
    description: 'Como Dante, quiero ver un resumen general del sistema para entender rápidamente qué está pasando.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 1,
  },
  {
    id: 'HU-2',
    title: 'Ver el total estimado de tokens usados',
    description: 'Como Dante, quiero ver el total estimado de tokens usados para tener control del consumo.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 1,
  },

  // Sprint 2 - Base Técnica + Dashboard Inicial (completado)
  {
    id: 'HU-3',
    title: 'Ver el costo estimado total',
    description: 'Como Dante, quiero ver el costo estimado total para entender cuánto están gastando mis agentes.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 2,
  },
  {
    id: 'HU-4',
    title: 'Ver el costo desagregado por agente',
    description: 'Como Dante, quiero ver el costo desagregado por agente para identificar cuáles consumen más recursos.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'medium',
    sprintNumber: 2,
  },
  {
    id: 'HU-9',
    title: 'Datos mock simulados inicialmente',
    description: 'Como Dante, quiero datos mock simulados inicialmente para prototipar sin datos reales.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'medium',
    sprintNumber: 2,
  },

  // Sprint 3 - Vista de Agentes (completado)
  {
    id: 'HU-5',
    title: 'Ver qué modelo usa cada agente',
    description: 'Como Dante, quiero ver qué modelo usa cada agente para entender la distribución de modelos.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'medium',
    sprintNumber: 3,
  },
  {
    id: 'HU-6',
    title: 'Ver el estado de cada agente',
    description: 'Como Dante, quiero ver el estado de cada agente (activo, idle, error) para saber en qué está cada uno.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 3,
  },
  {
    id: 'HU-7',
    title: 'Ver la última actividad de cada agente',
    description: 'Como Dante, quiero ver la última actividad de cada agente para tener contexto operativo básico.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'medium',
    sprintNumber: 3,
  },

  // Sprint 4 - Vista de Costos (completado)
  {
    id: 'HU-8',
    title: 'Filtrar información por agente o modelo',
    description: 'Como Dante, quiero filtrar información por agente o modelo para enfocar el monitoreo.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'medium',
    sprintNumber: 4,
  },

  // Sprint 5 - Filtros y Mejoras (completado)
  {
    id: 'HU-10',
    title: 'Página clara y presentable con varias vistas',
    description: 'Como Dante + Nico, queremos una página clara y presentable con varias vistas para uso interno profesional.',
    status: 'completed',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 5,
  },

  // Sprint 6 - Gestión de Sprints (en progreso)
  {
    id: 'HU-11',
    title: 'Tablero Kanban con Drag & Drop',
    description: 'Como Dante, quiero un tablero Kanban (Pendiente/En Progreso/Completado) para mover historias y visualizar avance del sprint.',
    status: 'in_progress',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 6,
  },

  // Sprint 7 - Mapa de Interacción (pendiente)
  {
    id: 'HU-12',
    title: 'Disparar acciones desde el dashboard',
    description: 'Como Dante, quiero disparar acciones desde el dashboard para activar flujo operativo de agentes manualmente.',
    status: 'pending',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 7,
  },
  {
    id: 'HU-13',
    title: 'Vista Grafo de Interacción',
    description: 'Como Dante, quiero ver líneas de comunicación Orquestador→PM→Subagentes para entender quién habla con quién.',
    status: 'pending',
    assignee: 'SE Dashboard',
    priority: 'medium',
    sprintNumber: 7,
  },

  // Sprint 8 - Control de Acciones y Deploy (pendiente)
  {
    id: 'HU-14',
    title: 'Rastro de mensajes (logs de chat)',
    description: 'Como Nico, quiero un rastro de mensajes (logs de chat) para entender por qué se tomó una decisión técnica.',
    status: 'pending',
    assignee: 'PM Dashboard',
    priority: 'medium',
    sprintNumber: 8,
  },
  {
    id: 'HU-15',
    title: 'Sistema preparado para producción (Cloud)',
    description: 'Como Equipo CS, queremos el sistema preparado para producción (Cloud) para conectar datos reales de OpenClaw.',
    status: 'pending',
    assignee: 'SE Dashboard',
    priority: 'high',
    sprintNumber: 8,
  },
];