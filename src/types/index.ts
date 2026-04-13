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

// Sprint / Kanban Types

export type StoryStatus = 'pending' | 'in_progress' | 'completed';

export type StoryPriority = 'low' | 'medium' | 'high';

export interface Story {
  id: string;
  title: string;
  description: string;
  status: StoryStatus;
  assignee: string;
  priority: StoryPriority;
  sprintNumber: number;
}

export interface SprintStats {
  sprintNumber: number;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  percentComplete: number;
}

// Agent Flow Types

export type AgentRole = 'orchestrator' | 'pm' | 'engineer';

export interface FlowNode {
  id: string;
  name: string;
  role: AgentRole;
  model: string;
  status: AgentStatus;
  lastMessage: string;
  lastActivity: string;
}

export interface FlowEdge {
  id: string;
  from: string; // FlowNode id
  to: string;   // FlowNode id
  label: string;
  type: 'command' | 'report' | 'task' | 'review';
}

export interface ChatLog {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: string;
  timestamp: string;
  type: 'command' | 'report' | 'task' | 'review';
}

// ─── Action Types ────────────────────────────────────────────────────────

export type ActionType = 'start' | 'stop' | 'restart' | 'send_message';

export interface ActionButton {
  id: string;
  label: string;
  action: ActionType;
  icon: string; // lucide icon name
  variant: 'primary' | 'danger' | 'warning' | 'default';
  requiresConfirmation: boolean;
}

export interface ActionExecution {
  id: string;
  action: ActionType;
  agentId: string;
  agentName: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
}