// Dashboard Agents - Data Service Layer
// Patrón Adapter: Este archivo es la ÚNICA fuente de datos para los componentes.
// Internamente lee de mockData, pero cuando se integre la API real,
// solo se cambia este archivo.

import type { Agent, Model, SystemMetrics, CostTimelinePoint, TokenActivityPoint, Story, SprintStats, FlowNode, FlowEdge, ChatLog, ActionType, ActionExecution } from '../types';
import {
  mockAgents,
  mockModels,
  mockSystemMetrics,
  mockCostTimeline,
  mockTokenActivity,
} from '../data/mockData';
import { mockStories } from '../data/mockSprints';
import { mockFlowNodes, mockFlowEdges, mockChatLogs } from '../data/mockFlow';

// Simula latencia de red para emular llamadas asíncronas
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAgents(): Promise<Agent[]> {
  await delay();
  return [...mockAgents];
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  await delay();
  return mockAgents.find((a) => a.id === id);
}

export async function getModels(): Promise<Model[]> {
  await delay();
  return [...mockModels];
}

export async function getMetrics(): Promise<SystemMetrics> {
  await delay();
  return { ...mockSystemMetrics };
}

export async function getCostTimeline(): Promise<CostTimelinePoint[]> {
  await delay();
  return [...mockCostTimeline];
}

export async function getTokenActivity(): Promise<TokenActivityPoint[]> {
  await delay();
  return [...mockTokenActivity];
}

export async function getCosts(): Promise<{
  timeline: CostTimelinePoint[];
  byModel: { modelId: string; modelName: string; cost: number; tokens: number }[];
  byAgent: { agentId: string; agentName: string; cost: number; tokens: number }[];
}> {
  await delay();
  const byModel = mockModels.map((model) => {
    const agents = mockAgents.filter((a) => a.modelId === model.id);
    const tokens = agents.reduce((sum, a) => sum + a.totalTokens, 0);
    const cost = agents.reduce((sum, a) => sum + a.totalCost, 0);
    return { modelId: model.id, modelName: model.name, cost, tokens };
  });

  const byAgent = mockAgents.map((agent) => ({
    agentId: agent.id,
    agentName: agent.name,
    cost: agent.totalCost,
    tokens: agent.totalTokens,
  }));

  return {
    timeline: [...mockCostTimeline],
    byModel,
    byAgent,
  };
}

// ─── Sprint / Kanban Services ────────────────────────────────────────────

export async function getStories(): Promise<Story[]> {
  await delay();
  return mockStories.map((s) => ({ ...s }));
}

export async function getStoriesBySprint(sprintNumber: number): Promise<Story[]> {
  await delay();
  return mockStories.filter((s) => s.sprintNumber === sprintNumber).map((s) => ({ ...s }));
}

export async function getSprintStats(): Promise<SprintStats[]> {
  await delay();
  const sprintNumbers = [...new Set(mockStories.map((s) => s.sprintNumber))].sort(
    (a, b) => a - b,
  );
  return sprintNumbers.map((sn) => {
    const stories = mockStories.filter((s) => s.sprintNumber === sn);
    const total = stories.length;
    const completed = stories.filter((s) => s.status === 'completed').length;
    const inProgress = stories.filter((s) => s.status === 'in_progress').length;
    const pending = stories.filter((s) => s.status === 'pending').length;
    return {
      sprintNumber: sn,
      total,
      completed,
      inProgress,
      pending,
      percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
}

// ─── Agent Flow Services ─────────────────────────────────────────────────

export async function getFlowNodes(): Promise<FlowNode[]> {
  await delay();
  return mockFlowNodes.map((n) => ({ ...n }));
}

export async function getFlowEdges(): Promise<FlowEdge[]> {
  await delay();
  return mockFlowEdges.map((e) => ({ ...e }));
}

export async function getChatLogs(): Promise<ChatLog[]> {
  await delay();
  return mockChatLogs.map((l) => ({ ...l }));
}

// ─── Action Services ─────────────────────────────────────────────────────
// TODO: Reemplazar con llamada real a OpenClaw API cuando se implemente el backend

// In-memory action history
let actionHistory: ActionExecution[] = [];
let actionIdCounter = 0;

function getNextActionId(): string {
  actionIdCounter += 1;
  return `action-${actionIdCounter}`;
}

/**
 * Simula ejecutar una acción sobre un agente.
 * Cambia el estado del agente en mockData y registra la acción en el historial.
 */
export async function executeAction(actionType: ActionType, agentId: string): Promise<ActionExecution> {
  const agent = mockAgents.find((a) => a.id === agentId);
  if (!agent) {
    const execution: ActionExecution = {
      id: getNextActionId(),
      action: actionType,
      agentId,
      agentName: agentId,
      timestamp: new Date().toISOString(),
      status: 'failed',
      message: `Agente ${agentId} no encontrado`,
    };
    actionHistory.unshift(execution);
    return execution;
  }

  // Simulated delay (1-2 seconds)
  const simulatedDelay = 1000 + Math.random() * 1000;
  await delay(simulatedDelay);

  // Determine new status based on action type
  let newStatus: Agent['status'];
  let message: string;

  switch (actionType) {
    case 'start':
      newStatus = 'active';
      message = `${agent.name} iniciado correctamente`;
      break;
    case 'stop':
      newStatus = 'offline';
      message = `${agent.name} detenido correctamente`;
      break;
    case 'restart':
      newStatus = 'active';
      message = `${agent.name} reiniciado correctamente`;
      break;
    case 'send_message':
      newStatus = agent.status; // no status change
      message = `Mensaje enviado a ${agent.name}`;
      break;
    default:
      newStatus = agent.status;
      message = `Acción ${actionType} ejecutada en ${agent.name}`;
  }

  // Update the agent's status in mockData
  agent.status = newStatus;
  agent.lastActive = new Date().toISOString();

  // Also update mockFlowNodes if the agent exists there
  const flowNode = mockFlowNodes.find((n) => n.id === agentId);
  if (flowNode) {
    flowNode.status = newStatus;
    flowNode.lastActivity = new Date().toISOString();
  }

  // Also update mockSystemMetrics
  mockSystemMetrics.activeAgents = mockAgents.filter((a) => a.status === 'active').length;
  mockSystemMetrics.totalAgents = mockAgents.length;
  mockSystemMetrics.lastUpdated = new Date().toISOString();

  const execution: ActionExecution = {
    id: getNextActionId(),
    action: actionType,
    agentId,
    agentName: agent.name,
    timestamp: new Date().toISOString(),
    status: 'success',
    message,
  };

  actionHistory.unshift(execution);
  return execution;
}

/**
 * Retorna el historial de acciones ejecutadas.
 */
export async function getActionHistory(): Promise<ActionExecution[]> {
  await delay(100);
  return [...actionHistory];
}

/**
 * Ejecuta una acción sobre múltiples agentes (batch).
 */
export async function executeBatchAction(
  actionType: ActionType,
  agentIds: string[],
): Promise<ActionExecution[]> {
  const results: ActionExecution[] = [];
  for (const agentId of agentIds) {
    const result = await executeAction(actionType, agentId);
    results.push(result);
  }
  return results;
}