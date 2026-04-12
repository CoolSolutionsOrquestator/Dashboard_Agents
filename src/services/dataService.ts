// Dashboard Agents - Data Service Layer
// Patrón Adapter: Este archivo es la ÚNICA fuente de datos para los componentes.
// Internamente lee de mockData, pero cuando se integre la API real,
// solo se cambia este archivo.

import type { Agent, Model, SystemMetrics, CostTimelinePoint, TokenActivityPoint } from '../types';
import {
  mockAgents,
  mockModels,
  mockSystemMetrics,
  mockCostTimeline,
  mockTokenActivity,
} from '../data/mockData';

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