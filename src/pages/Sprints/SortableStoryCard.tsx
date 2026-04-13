import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Story } from '../../types';

interface SortableStoryCardProps {
  story: Story;
  priorityConfig: Record<string, { label: string; className: string }>;
}

export function SortableStoryCard({ story, priorityConfig }: SortableStoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: story.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[story.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group cursor-grab rounded-lg border border-gray-700/70 bg-gray-800/80 p-3 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 ${
        isDragging ? 'z-50 opacity-70 shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{story.id}</span>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${priority.className}`}
            >
              {priority.label}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-gray-100 leading-snug">
            {story.title}
          </h4>
          <p className="mt-1 text-xs text-gray-400 line-clamp-2">{story.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            Asignado: <span className="text-gray-300">{story.assignee}</span>
          </div>
        </div>
        <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}