// Dashboard Agents - TypeScript Types
// Modelo de datos para el MVP

export type AgentStatus = 'active' | 'idle' | 'offline' | 'error';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  modelId: string;
  totalTokens: number;
  totalCost: number; // En USD
  lastActive: string; // ISO 8601 Date string
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  inputCostPer1k: number;
  outputCostPer1k: number;
  assignedAgents: string[]; // Array de Agent IDs
}

export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalCost: number;
  totalTokens: number;
  lastUpdated: string;
}

export interface CostTimelinePoint {
  date: string;
  cost: number;
  tokens: number;
}

export interface TokenActivityPoint {
  date: string;
  tokens: number;
}