'use client';

import { Vibe, Comment, Profile, UserRole } from '@/types';
import { MOCK_VIBES, MOCK_COMMENTS, MOCK_PROFILES } from './mock-data';
import { createClient } from './supabase/client';

const VIBES_STORAGE_KEY = 'vibeui_local_vibes';
const COMMENTS_STORAGE_KEY = 'vibeui_local_comments';
const STARS_STORAGE_KEY = 'vibeui_user_stars';
const RATINGS_STORAGE_KEY = 'vibeui_user_ratings';
const CURRENT_USER_KEY = 'vibeui_active_user';

export function getLocalVibes(): Vibe[] {
  if (typeof window === 'undefined') return MOCK_VIBES;
  const stored = localStorage.getItem(VIBES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(VIBES_STORAGE_KEY, JSON.stringify(MOCK_VIBES));
    return MOCK_VIBES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_VIBES;
  }
}

export function saveLocalVibes(vibes: Vibe[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VIBES_STORAGE_KEY, JSON.stringify(vibes));
}

export function getLocalComments(vibeId?: string): Comment[] {
  if (typeof window === 'undefined') return MOCK_COMMENTS;
  const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
  let allComments: Comment[] = MOCK_COMMENTS;
  if (stored) {
    try {
      allComments = JSON.parse(stored);
    } catch {
      allComments = MOCK_COMMENTS;
    }
  } else {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(MOCK_COMMENTS));
  }

  if (vibeId) {
    return allComments.filter((c) => c.vibe_id === vibeId);
  }
  return allComments;
}

export function addLocalComment(vibeId: string, content: string, user: Profile): Comment {
  const allComments = getLocalComments();
  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    vibe_id: vibeId,
    user_id: user.id,
    content,
    created_at: new Date().toISOString(),
    author: user,
  };
  const updated = [newComment, ...allComments];
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));
  return newComment;
}

export function getUserStarred(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STARS_STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function toggleStarLocal(vibeId: string): { hasStarred: boolean; newCount: number } {
  const starredMap = getUserStarred();
  const currentlyStarred = !!starredMap[vibeId];
  const newStarred = !currentlyStarred;
  starredMap[vibeId] = newStarred;
  localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(starredMap));

  const vibes = getLocalVibes();
  let newCount = 0;
  const updatedVibes = vibes.map((v) => {
    if (v.id === vibeId) {
      newCount = Math.max(0, v.star_count + (newStarred ? 1 : -1));
      return { ...v, star_count: newCount, has_starred: newStarred };
    }
    return v;
  });
  saveLocalVibes(updatedVibes);
  return { hasStarred: newStarred, newCount };
}

export function getUserRatings(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function rateVibeLocal(vibeId: string, rating: number): { avgRating: number; count: number } {
  const ratingsMap = getUserRatings();
  ratingsMap[vibeId] = rating;
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratingsMap));

  const vibes = getLocalVibes();
  let avgRating = 5.0;
  let count = 1;

  const updatedVibes = vibes.map((v) => {
    if (v.id === vibeId) {
      const currentTotal = v.avg_rating * (v.rating_count || 1);
      count = (v.rating_count || 1) + 1;
      avgRating = Number(((currentTotal + rating) / count).toFixed(2));
      return { ...v, avg_rating: avgRating, rating_count: count, user_rating: rating };
    }
    return v;
  });
  saveLocalVibes(updatedVibes);
  return { avgRating, count };
}

export function getActiveUser(): Profile {
  if (typeof window === 'undefined') return MOCK_PROFILES[0];
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(MOCK_PROFILES[0]));
    return MOCK_PROFILES[0];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_PROFILES[0];
  }
}

export function setActiveUser(user: Profile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function createVibeLocal(vibeData: Omit<Vibe, 'id' | 'created_at' | 'updated_at' | 'star_count' | 'avg_rating' | 'rating_count' | 'views_count'>): Vibe {
  const vibes = getLocalVibes();
  const newVibe: Vibe = {
    ...vibeData,
    id: `vibe-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    star_count: 0,
    avg_rating: 5.0,
    rating_count: 1,
    views_count: 1,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updated = [newVibe, ...vibes];
  saveLocalVibes(updated);
  return newVibe;
}

export function deleteVibeLocal(vibeId: string): boolean {
  const vibes = getLocalVibes();
  const updated = vibes.filter((v) => v.id !== vibeId);
  saveLocalVibes(updated);
  return true;
}

export function toggleFeatureVibeLocal(vibeId: string): boolean {
  const vibes = getLocalVibes();
  let newState = false;
  const updated = vibes.map((v) => {
    if (v.id === vibeId) {
      newState = !v.is_featured;
      return { ...v, is_featured: newState };
    }
    return v;
  });
  saveLocalVibes(updated);
  return newState;
}
