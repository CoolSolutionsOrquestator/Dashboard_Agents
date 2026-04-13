import { useState, useEffect, useCallback } from 'react';
import type { Story, SprintStats, StoryStatus } from '../types';
import { getStories, getSprintStats } from '../services/dataService';

export function useSprints() {
  const [stories, setStories] = useState<Story[]>([]);
  const [sprintStats, setSprintStats] = useState<SprintStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [storiesData, statsData] = await Promise.all([
        getStories(),
        getSprintStats(),
      ]);
      setStories(storiesData);
      setSprintStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading sprints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const moveStory = useCallback((storyId: string, newStatus: StoryStatus) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, status: newStatus } : s)),
    );
  }, []);

  const getStoriesBySprint = useCallback(
    (sprintNumber: number | null) => {
      if (sprintNumber === null) return stories;
      return stories.filter((s) => s.sprintNumber === sprintNumber);
    },
    [stories],
  );

  const getFilteredStats = useCallback(
    (sprintNumber: number | null): SprintStats | null => {
      if (sprintNumber === null) {
        // Overall stats
        const total = stories.length;
        const completed = stories.filter((s) => s.status === 'completed').length;
        const inProgress = stories.filter((s) => s.status === 'in_progress').length;
        const pending = stories.filter((s) => s.status === 'pending').length;
        return {
          sprintNumber: 0,
          total,
          completed,
          inProgress,
          pending,
          percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      }
      return sprintStats.find((s) => s.sprintNumber === sprintNumber) ?? null;
    },
    [stories, sprintStats],
  );

  return { stories, sprintStats, loading, error, moveStory, getStoriesBySprint, getFilteredStats };
}