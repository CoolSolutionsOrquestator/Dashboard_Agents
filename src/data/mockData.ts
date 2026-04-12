// Dashboard Agents - Mock Data
// Datos representativos de los modelos Ollama Cloud de Cool Solutions

import type { Agent, Model, SystemMetrics, CostTimelinePoint, TokenActivityPoint } from '../types';

export const mockSystemMetrics: SystemMetrics = {
  totalAgents: 5,
  activeAgents: 2,
  totalCost: 8.32,
  totalTokens: 1245000,
  lastUpdated: '2026-04-12T22:30:00Z',
};

export const mockModels: Model[] = [
  {
    id: 'glm-5.1',
    name: 'GLM-5.1',
    provider: 'Ollama Cloud',
    inputCostPer1k: 0.0,
    outputCostPer1k: 0.0,
    assignedAgents: ['agent-1'],
  },
  {
    id: 'llama3.1-8b',
    name: 'Llama 3.1 8B',
    provider: 'Ollama Cloud',
    inputCostPer1k: 0.0,
    outputCostPer1k: 0.0,
    assignedAgents: ['agent-2', 'agent-4'],
  },
  {
    id: 'qwen2.5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Ollama Cloud',
    inputCostPer1k: 0.0,
    outputCostPer1k: 0.0,
    assignedAgents: ['agent-3', 'agent-5'],
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    inputCostPer1k: 0.00125,
    outputCostPer1k: 0.005,
    assignedAgents: [],
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'El Orquestador',
    status: 'active',
    modelId: 'glm-5.1',
    totalTokens: 450000,
    totalCost: 0.0,
    lastActive: '2026-04-12T22:29:00Z',
  },
  {
    id: 'agent-2',
    name: 'PM Dashboard',
    status: 'idle',
    modelId: 'llama3.1-8b',
    totalTokens: 85000,
    totalCost: 0.0,
    lastActive: '2026-04-12T22:05:00Z',
  },
  {
    id: 'agent-3',
    name: 'SE Dashboard',
    status: 'idle',
    modelId: 'qwen2.5-coder-32b',
    totalTokens: 320000,
    totalCost: 0.0,
    lastActive: '2026-04-12T21:45:00Z',
  },
  {
    id: 'agent-4',
    name: 'PM Ventas',
    status: 'offline',
    modelId: 'llama3.1-8b',
    totalTokens: 150000,
    totalCost: 0.0,
    lastActive: '2026-04-11T14:30:00Z',
  },
  {
    id: 'agent-5',
    name: 'SE Ventas',
    status: 'error',
    modelId: 'qwen2.5-coder-32b',
    totalTokens: 240000,
    totalCost: 0.0,
    lastActive: '2026-04-12T19:00:00Z',
  },
];

// Actividad de tokens últimos 7 días
export const mockTokenActivity: TokenActivityPoint[] = [
  { date: '2026-04-06', tokens: 145000 },
  { date: '2026-04-07', tokens: 198000 },
  { date: '2026-04-08', tokens: 172000 },
  { date: '2026-04-09', tokens: 210000 },
  { date: '2026-04-10', tokens: 165000 },
  { date: '2026-04-11', tokens: 230000 },
  { date: '2026-04-12', tokens: 125000 },
];

// Timeline de costos últimos 7 días
export const mockCostTimeline: CostTimelinePoint[] = [
  { date: '2026-04-06', cost: 1.15, tokens: 145000 },
  { date: '2026-04-07', cost: 1.42, tokens: 198000 },
  { date: '2026-04-08', cost: 1.28, tokens: 172000 },
  { date: '2026-04-09', cost: 1.56, tokens: 210000 },
  { date: '2026-04-10', cost: 1.22, tokens: 165000 },
  { date: '2026-04-11', cost: 1.69, tokens: 230000 },
  { date: '2026-04-12', cost: 0.95, tokens: 125000 },
];