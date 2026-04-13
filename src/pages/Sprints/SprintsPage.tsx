import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Columns, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSprints } from '../../hooks/useSprints';
import type { Story, StoryStatus } from '../../types';
import { SortableStoryCard } from './SortableStoryCard';
import { KanbanColumn } from './KanbanColumn';

const SPRINT_OPTIONS = [
  { value: null, label: 'Todos' },
  { value: 6, label: 'Sprint 6' },
  { value: 7, label: 'Sprint 7' },
  { value: 8, label: 'Sprint 8' },
];

const COLUMNS: { status: StoryStatus; title: string; icon: typeof Clock; color: string; bgColor: string; borderColor: string }[] = [
  {
    status: 'pending',
    title: 'Pendiente',
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-800/50',
    borderColor: 'border-gray-700',
  },
  {
    status: 'in_progress',
    title: 'En Progreso',
    icon: AlertCircle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/30',
    borderColor: 'border-amber-700/50',
  },
  {
    status: 'completed',
    title: 'Completado',
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'bg-green-950/30',
    borderColor: 'border-green-700/50',
  },
];

const PRIORITY_CONFIG = {
  low: { label: 'Baja', className: 'bg-gray-700 text-gray-300' },
  medium: { label: 'Media', className: 'bg-amber-700/50 text-amber-300' },
  high: { label: 'Alta', className: 'bg-red-700/50 text-red-300' },
};

export function SprintsPage() {
  const { stories, loading, error, moveStory, getStoriesBySprint, getFilteredStats } = useSprints();
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const filteredStories = getStoriesBySprint(selectedSprint);
  const stats = getFilteredStats(selectedSprint);

  const storiesByStatus = (status: StoryStatus) =>
    filteredStories.filter((s) => s.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const storyId = String(active.id);
    // Determine target status from the column we dropped into
    const overId = String(over.id);

    // over.id will be the column status or a story id within the column
    let newStatus: StoryStatus | null = null;

    // Check if dropped on a column droppable
    if (overId === 'pending' || overId === 'in_progress' || overId === 'completed') {
      newStatus = overId as StoryStatus;
    } else {
      // Dropped on another story card — find the story and use its status
      const targetStory = stories.find((s) => s.id === overId);
      if (targetStory) {
        newStatus = targetStory.status;
      }
    }

    if (newStatus) {
      moveStory(storyId, newStatus);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeStory = activeId ? stories.find((s) => s.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Columns className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Gestión de Sprints</h1>
            <p className="text-sm text-gray-400">
              Kanban Board · Arrastra las historias entre columnas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sprint selector */}
          <select
            value={selectedSprint ?? ''}
            onChange={(e) =>
              setSelectedSprint(e.target.value === '' ? null : Number(e.target.value))
            }
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SPRINT_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Completion indicator */}
          {stats && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2">
              <span className="text-sm text-gray-400">Completitud</span>
              <span className="text-lg font-bold text-blue-400">
                {stats.percentComplete}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              icon={col.icon}
              color={col.color}
              bgColor={col.bgColor}
              borderColor={col.borderColor}
              storyCount={storiesByStatus(col.status).length}
            >
              <SortableContext
                items={storiesByStatus(col.status).map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 p-3">
                  {storiesByStatus(col.status).map((story) => (
                    <SortableStoryCard
                      key={story.id}
                      story={story}
                      priorityConfig={PRIORITY_CONFIG}
                    />
                  ))}
                  {storiesByStatus(col.status).length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">
                      Sin historias
                    </div>
                  )}
                </div>
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeStory ? (
            <StoryCardOverlay story={activeStory} priorityConfig={PRIORITY_CONFIG} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Progress Bar */}
      {stats && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Progreso{selectedSprint ? ` — Sprint ${selectedSprint}` : ' — Todos los Sprints'}
            </span>
            <span className="text-gray-300">
              {stats.completed} completadas / {stats.total} total
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${stats.percentComplete}%` }}
            />
          </div>
          <div className="mt-2 flex gap-4 text-xs text-gray-500">
            <span>
              <span className="inline-block h-2 w-2 rounded-full bg-gray-500" /> Pendiente:{' '}
              {stats.pending}
            </span>
            <span>
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> En Progreso:{' '}
              {stats.inProgress}
            </span>
            <span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Completado:{' '}
              {stats.completed}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Story Card Overlay (shown while dragging) ──────────────────────────
function StoryCardOverlay({
  story,
  priorityConfig,
}: {
  story: Story;
  priorityConfig: Record<string, { label: string; className: string }>;
}) {
  const priority = priorityConfig[story.priority];
  return (
    <div className="w-72 rounded-lg border border-blue-500/50 bg-gray-800 p-3 shadow-xl shadow-blue-500/10">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{story.id}</span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${priority.className}`}
        >
          {priority.label}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-100">{story.title}</h4>
      <p className="mt-1 text-xs text-gray-400 line-clamp-2">{story.description}</p>
      <div className="mt-2 text-xs text-gray-500">
        Asignado: <span className="text-gray-300">{story.assignee}</span>
      </div>
    </div>
  );
}