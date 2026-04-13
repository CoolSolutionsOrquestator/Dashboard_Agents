import { useDroppable } from '@dnd-kit/core';
import type { StoryStatus } from '../../types';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface KanbanColumnProps {
  status: StoryStatus;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  storyCount: number;
  children: ReactNode;
}

export function KanbanColumn({
  status,
  title,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  storyCount,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border ${borderColor} ${bgColor} transition-colors duration-200 ${
        isOver ? 'ring-2 ring-blue-500/40' : ''
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-gray-300">
          {storyCount}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex-1 min-h-[120px]">{children}</div>
    </div>
  );
}