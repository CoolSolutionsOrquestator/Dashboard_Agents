// Dashboard Agents - Mock Flow Data
// Datos de interacción entre agentes para la vista Agent Flow

import type { FlowNode, FlowEdge, ChatLog } from '../types';

export const mockFlowNodes: FlowNode[] = [
  {
    id: 'agent-1',
    name: 'El Orquestador',
    role: 'orchestrator',
    model: 'GLM-5.1',
    status: 'active',
    lastMessage: 'Coordinando Sprint 7',
    lastActivity: '2026-04-12T22:30:00Z',
  },
  {
    id: 'agent-2',
    name: 'PM Dashboard',
    role: 'pm',
    model: 'Llama 3.1 8B',
    status: 'idle',
    lastMessage: 'Sprint 6 completado',
    lastActivity: '2026-04-12T22:05:00Z',
  },
  {
    id: 'agent-3',
    name: 'SE Dashboard',
    role: 'engineer',
    model: 'Qwen 2.5 Coder 32B',
    status: 'active',
    lastMessage: 'Implementando Agent Flow',
    lastActivity: '2026-04-12T22:25:00Z',
  },
  {
    id: 'agent-4',
    name: 'PM Ventas',
    role: 'pm',
    model: 'Llama 3.1 8B',
    status: 'offline',
    lastMessage: 'Sin actividad',
    lastActivity: '2026-04-11T14:30:00Z',
  },
  {
    id: 'agent-5',
    name: 'SE Ventas',
    role: 'engineer',
    model: 'Qwen 2.5 Coder 32B',
    status: 'error',
    lastMessage: 'Error en ejecución',
    lastActivity: '2026-04-12T19:00:00Z',
  },
];

export const mockFlowEdges: FlowEdge[] = [
  {
    id: 'edge-1',
    from: 'agent-1',
    to: 'agent-2',
    label: 'Asignar sprint',
    type: 'command',
  },
  {
    id: 'edge-2',
    from: 'agent-1',
    to: 'agent-4',
    label: 'Asignar proyecto',
    type: 'command',
  },
  {
    id: 'edge-3',
    from: 'agent-2',
    to: 'agent-3',
    label: 'Asignar story point',
    type: 'task',
  },
  {
    id: 'edge-4',
    from: 'agent-3',
    to: 'agent-2',
    label: 'Reportar progreso',
    type: 'report',
  },
  {
    id: 'edge-5',
    from: 'agent-2',
    to: 'agent-1',
    label: 'Checkpoint',
    type: 'review',
  },
  {
    id: 'edge-6',
    from: 'agent-4',
    to: 'agent-5',
    label: 'Asignar tarea',
    type: 'task',
  },
];

export const mockChatLogs: ChatLog[] = [
  {
    id: 'log-1',
    fromAgent: 'agent-1',
    toAgent: 'agent-2',
    message: 'Iniciar Sprint 7 - Agent Flow. Crear vista de grafo de interacción.',
    timestamp: '2026-04-12T22:30:00Z',
    type: 'command',
  },
  {
    id: 'log-2',
    fromAgent: 'agent-1',
    toAgent: 'agent-4',
    message: 'Asignar proyecto Ventas: automatizar pipeline de leads.',
    timestamp: '2026-04-12T22:28:00Z',
    type: 'command',
  },
  {
    id: 'log-3',
    fromAgent: 'agent-2',
    toAgent: 'agent-3',
    message: 'SP-7.1: Crear tipos FlowNode, FlowEdge, ChatLog en types/index.ts',
    timestamp: '2026-04-12T22:20:00Z',
    type: 'task',
  },
  {
    id: 'log-4',
    fromAgent: 'agent-3',
    toAgent: 'agent-2',
    message: 'Progreso SP-7.1: Tipos agregados. Iniciando mock data.',
    timestamp: '2026-04-12T22:25:00Z',
    type: 'report',
  },
  {
    id: 'log-5',
    fromAgent: 'agent-2',
    toAgent: 'agent-1',
    message: 'Checkpoint Sprint 7: SP-7.1 en progreso, SP-7.2 pendiente.',
    timestamp: '2026-04-12T22:26:00Z',
    type: 'review',
  },
  {
    id: 'log-6',
    fromAgent: 'agent-4',
    toAgent: 'agent-5',
    message: 'Tarea: Integrar API de CRM con el módulo de ventas.',
    timestamp: '2026-04-11T14:35:00Z',
    type: 'task',
  },
  {
    id: 'log-7',
    fromAgent: 'agent-5',
    toAgent: 'agent-4',
    message: 'Error: Fallo al conectar con endpoint /api/crm/leads. Reintentando...',
    timestamp: '2026-04-12T18:55:00Z',
    type: 'report',
  },
  {
    id: 'log-8',
    fromAgent: 'agent-2',
    toAgent: 'agent-3',
    message: 'SP-7.2: Implementar grafo de interacción con SVG positioning.',
    timestamp: '2026-04-12T22:27:00Z',
    type: 'task',
  },
];