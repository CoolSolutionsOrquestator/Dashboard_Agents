import { useState } from 'react';
import { GitBranch, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useFlow } from '../../hooks/useFlow';
import type { FlowNode, FlowEdge, ChatLog } from '../../types';

// ─── Color map for edge types ────────────────────────────────────────────
const edgeColorMap: Record<FlowEdge['type'], { stroke: string; bg: string; text: string; hex: string }> = {
  command: { stroke: 'stroke-blue-400', bg: 'bg-blue-500/10', text: 'text-blue-400', hex: '#60a5fa' },
  task:    { stroke: 'stroke-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400', hex: '#fbbf24' },
  report:  { stroke: 'stroke-green-400', bg: 'bg-green-500/10', text: 'text-green-400', hex: '#4ade80' },
  review:  { stroke: 'stroke-violet-400', bg: 'bg-violet-500/10', text: 'text-violet-400', hex: '#a78bfa' },
};

const edgeLabelMap: Record<FlowEdge['type'], string> = {
  command: 'Command',
  task: 'Task',
  report: 'Report',
  review: 'Review',
};

const roleLabelMap: Record<FlowNode['role'], string> = {
  orchestrator: 'Orquestador',
  pm: 'PM',
  engineer: 'SE',
};

const roleRingMap: Record<FlowNode['role'], string> = {
  orchestrator: 'ring-blue-500',
  pm: 'ring-amber-500',
  engineer: 'ring-emerald-500',
};

// ─── Relative time formatter ─────────────────────────────────────────────
function relativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD}d`;
}

// ─── Node positions (fixed layout: Orchestrator top, PMs middle, SEs bottom) ─
// Layout grid: 3 rows, positions in percentages
function getNodePosition(node: FlowNode): { x: number; y: number } {
  switch (node.id) {
    case 'agent-1': return { x: 50, y: 10 };   // Orchestrator - top center
    case 'agent-2': return { x: 28, y: 45 };   // PM Dashboard - mid left
    case 'agent-4': return { x: 72, y: 45 };   // PM Ventas - mid right
    case 'agent-3': return { x: 28, y: 80 };   // SE Dashboard - bottom left
    case 'agent-5': return { x: 72, y: 80 };   // SE Ventas - bottom right
    default:       return { x: 50, y: 50 };
  }
}

// ─── FlowNode Card ───────────────────────────────────────────────────────
function FlowNodeCard({ node, highlighted }: { node: FlowNode; highlighted: boolean }) {
  const pos = getNodePosition(node);
  const isOffline = node.status === 'offline';
  const isError = node.status === 'error';
  const isActive = node.status === 'active';

  const borderClass = isError
    ? 'border-red-500/70'
    : isActive
    ? 'border-green-500/50'
    : 'border-gray-700';

  return (
    <div
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`absolute w-52 rounded-xl border bg-gray-900 p-3 shadow-lg transition-all duration-300 ${borderClass} ${highlighted ? 'ring-2 ring-blue-400 scale-105' : ''} ${isOffline ? 'opacity-40' : 'opacity-100'}`}
    >
      {/* Breathing animation for active nodes */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 animate-pulse rounded-xl border-2 border-green-400/30" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              {roleLabelMap[node.role]}
            </span>
            <StatusBadge status={node.status} />
          </div>
          <h4 className="mt-1 truncate text-sm font-semibold text-gray-100">{node.name}</h4>
        </div>
      </div>

      <p className="mt-1 text-xs text-gray-500">{node.model}</p>
      <p className="mt-1.5 truncate text-xs text-gray-400" title={node.lastMessage}>
        💬 {node.lastMessage}
      </p>
      <p className="mt-1 text-[10px] text-gray-600">{relativeTime(node.lastActivity)}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export function FlowPage() {
  const { nodes, edges, logs, loading } = useFlow();
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400">Cargando Agent Flow...</div>
      </div>
    );
  }

  // Build a lookup for agent names
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Determine which node IDs are part of the selected edge
  const highlightedNodes = new Set<string>();
  if (selectedEdge) {
    const edge = edges.find((e) => e.id === selectedEdge);
    if (edge) {
      highlightedNodes.add(edge.from);
      highlightedNodes.add(edge.to);
    }
  }

  // SVG edge computation
  function getEdgePath(edge: FlowEdge) {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) return '';
    const from = getNodePosition(fromNode);
    const to = getNodePosition(toNode);
    // Curved path for bidirectional edges that share same node pair
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const isReverse = edges.some(
      (e) => e.from === edge.to && e.to === edge.from && e.id < edge.id,
    );
    // Offset for parallel edges
    const offset = isReverse ? -4 : 4;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    // Control point offset perpendicular to the line
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = len > 0 ? -dy / len : 0;
    const ny = len > 0 ? dx / len : 0;
    const cx = midX + nx * offset;
    const cy = midY + ny * offset;
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }

  // Edge label position (midpoint of the curve)
  function getEdgeLabelPos(edge: FlowEdge) {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) return { x: 50, y: 50 };
    const from = getNodePosition(fromNode);
    const to = getNodePosition(toNode);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const isReverse = edges.some(
      (e) => e.from === edge.to && e.to === edge.from && e.id < edge.id,
    );
    const offset = isReverse ? -4 : 4;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = len > 0 ? -dy / len : 0;
    const ny = len > 0 ? dx / len : 0;
    return { x: midX + nx * offset, y: midY + ny * offset };
  }

  // Arrow head position (near target)
  function getArrowPos(edge: FlowEdge) {
    const toNode = nodes.find((n) => n.id === edge.to);
    if (!toNode) return { x: 0, y: 0 };
    const to = getNodePosition(toNode);
    const fromNode = nodes.find((n) => n.id === edge.from);
    if (!fromNode) return to;
    const from = getNodePosition(fromNode);
    // Position arrow 12% away from target (so it doesn't overlap the node card)
    const t = 0.85;
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }

  function handleLogClick(log: ChatLog) {
    // Find the edge that matches this log's from→to and type
    const match = edges.find(
      (e) => e.from === log.fromAgent && e.to === log.toAgent,
    );
    if (match) {
      setSelectedEdge(match.id === selectedEdge ? null : match.id);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Flow</h1>
        <p className="text-sm text-gray-400">
          Mapa de interacción — cómo se comunican los agentes
        </p>
      </div>

      {/* Section A: Graph */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="relative h-[480px] w-full sm:h-[520px] lg:h-[560px]">
          {/* SVG layer for edges */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {Object.entries(edgeColorMap).map(([type, colors]) => (
                <marker
                  key={type}
                  id={`arrow-${type}`}
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="3"
                  markerHeight="3"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.hex} />
                </marker>
              ))}
            </defs>

            {edges.map((edge) => {
              const colors = edgeColorMap[edge.type];
              const isSelected = selectedEdge === edge.id;
              return (
                <g key={edge.id}>
                  <path
                    d={getEdgePath(edge)}
                    fill="none"
                    stroke={colors.hex}
                    strokeWidth={isSelected ? 0.8 : 0.4}
                    strokeDasharray={isSelected ? '' : '2 1'}
                    markerEnd={`url(#arrow-${edge.type})`}
                    opacity={isSelected ? 1 : 0.6}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Edge labels */}
          {edges.map((edge) => {
            const colors = edgeColorMap[edge.type];
            const pos = getEdgeLabelPos(edge);
            const isSelected = selectedEdge === edge.id;
            return (
              <div
                key={`label-${edge.id}`}
                className={`pointer-events-auto absolute cursor-pointer text-[9px] font-medium transition-all duration-300 ${colors.text} ${isSelected ? 'scale-110 font-bold' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedEdge(selectedEdge === edge.id ? null : edge.id)}
                title={`${edge.label} (${edgeLabelMap[edge.type]})`}
              >
                <span className={`rounded px-1 py-0.5 ${colors.bg} whitespace-nowrap`}>
                  {edge.label}
                </span>
              </div>
            );
          })}

          {/* Node cards */}
          {nodes.map((node) => (
            <FlowNodeCard
              key={node.id}
              node={node}
              highlighted={highlightedNodes.has(node.id)}
            />
          ))}
        </div>
      </div>

      {/* Section B: Legend */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Edge colors */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-300">Líneas de Comunicación</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(edgeColorMap).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <span className={`h-0.5 w-5 ${colors.bg.replace('/10', '')} rounded`} style={{ backgroundColor: colors.hex }} />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {edgeLabelMap[type as FlowEdge['type']]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Node statuses */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-300">Estados de Nodos</h3>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="idle" />
            <StatusBadge status="offline" />
            <StatusBadge status="error" />
          </div>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <p>● <span className="text-green-400">Activo</span> — borde pulsante</p>
            <p>● <span className="text-red-400">Error</span> — borde rojo</p>
            <p>● <span className="text-gray-400">Offline</span> — opacidad baja</p>
          </div>
        </div>
      </div>

      {/* Section C: Chat Log */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold">Log de Mensajes</h3>
        </div>

        <div className="space-y-2">
          {logs.map((log) => {
            const fromName = nodeMap.get(log.fromAgent)?.name ?? log.fromAgent;
            const toName = nodeMap.get(log.toAgent)?.name ?? log.toAgent;
            const colors = edgeColorMap[log.type];
            const isHighlighted = selectedEdge
              ? edges.some(
                  (e) =>
                    e.id === selectedEdge &&
                    e.from === log.fromAgent &&
                    e.to === log.toAgent,
                )
              : false;

            return (
              <button
                key={log.id}
                onClick={() => handleLogClick(log)}
                className={`w-full cursor-pointer text-left rounded-lg border px-4 py-3 transition-all duration-200 ${
                  isHighlighted
                    ? `${colors.bg} ${colors.text} border-current`
                    : 'border-gray-800 bg-gray-800/30 hover:bg-gray-800/60 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-100">{fromName}</span>
                    <span className="text-gray-600">→</span>
                    <span className="font-medium text-gray-100">{toName}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                      {edgeLabelMap[log.type]}
                    </span>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-600">
                    {relativeTime(log.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{log.message}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <GitBranch className="h-4 w-4" />
        <span>Agent Flow — Sprint 7 · Cool Solutions</span>
      </div>
    </div>
  );
}