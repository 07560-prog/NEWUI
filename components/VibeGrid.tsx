'use client';

import React, { useState, useMemo } from 'react';
import { Vibe, VibeCategory, SortOption, ViewMode } from '@/types';
import VibeCard from './VibeCard';

interface VibeGridProps {
  initialVibes: Vibe[];
}

const CATEGORIES: ('All' | VibeCategory)[] = [
  'All',
  'Minimal',
  'Typography',
  'Cyberpunk',
  'Brutalist',
  'Glassmorphism',
  'Interactive',
  'Retro',
];

export default function VibeGrid({ initialVibes }: VibeGridProps) {
  const [vibes, setVibes] = useState<Vibe[]>(initialVibes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | VibeCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('starred');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredVibes = useMemo(() => {
    return vibes
      .filter((vibe) => {
        const matchesCategory =
          selectedCategory === 'All' || vibe.category === selectedCategory;
        const matchesSearch =
          searchQuery === '' ||
          vibe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vibe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vibe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'starred') return b.star_count - a.star_count;
        if (sortBy === 'rated') return b.avg_rating - a.avg_rating;
        if (sortBy === 'trending') return (b.views_count || 0) - (a.views_count || 0);
        if (sortBy === 'newest')
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return 0;
      });
  }, [vibes, selectedCategory, searchQuery, sortBy]);

  const handleStarUpdate = (vibeId: string, newCount: number, hasStarred: boolean) => {
    setVibes((prev) =>
      prev.map((v) =>
        v.id === vibeId ? { ...v, star_count: newCount, has_starred: hasStarred } : v
      )
    );
  };

  return (
    <div id="gallery" className="w-full space-y-4 text-xs">
      {/* Gallery Section Header */}
      <div className="bg-[#E6F4F7] border-2 border-[#487A8A] p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-[#D26432] font-bold text-sm">◆</span>
          <h2 className="font-bold text-base text-[#224466]">
            GALLERY (UI ARTIFACT REPOSITORY)
          </h2>
          <span className="text-[11px] text-[#666]">
            ({filteredVibes.length} artifacts on display)
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 text-[11px]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2 py-0.5 border ${
              viewMode === 'grid'
                ? 'bg-[#FF7733] text-white border-[#D26432] font-bold'
                : 'bg-white text-[#333] border-[#808080]'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-0.5 border ${
              viewMode === 'list'
                ? 'bg-[#FF7733] text-white border-[#D26432] font-bold'
                : 'bg-white text-[#333] border-[#808080]'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Retro Search & Filter Strip */}
      <div className="yachiyo-panel p-3 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="flex items-center space-x-2 flex-1">
            <span className="font-bold text-[#333]">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keywords, tags, styles (e.g. canvas, clock, zen)..."
              className="flex-1 bg-white border border-[#487A8A] px-2 py-1 text-xs outline-none focus:border-[#FF7733]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#0000CD] underline text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-bold text-[#333]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-[#487A8A] px-2 py-1 text-xs cursor-pointer outline-none"
            >
              <option value="starred">★ Most Starred</option>
              <option value="rated">★ Highest Rated</option>
              <option value="newest">★ Newest First</option>
              <option value="trending">★ Most Views</option>
            </select>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex items-center flex-wrap gap-1 border-t border-dotted border-[#487A8A] pt-2 text-[11px]">
          <span className="font-bold text-[#333] mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#487A8A] text-white border-[#487A8A] font-bold'
                  : 'bg-white text-[#0000CD] border-[#ccc] hover:border-[#487A8A]'
              }`}
            >
              {cat === 'All' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or List Display */}
      {filteredVibes.length === 0 ? (
        <div className="yachiyo-panel p-8 text-center text-[#666]">
          No artifacts matched your search query.<br />
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-[#0000CD] underline mt-2 inline-block font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVibes.map((vibe, idx) => (
            <VibeCard
              key={vibe.id}
              vibe={vibe}
              index={idx}
              viewMode="grid"
              onStarUpdate={handleStarUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredVibes.map((vibe, idx) => (
            <VibeCard
              key={vibe.id}
              vibe={vibe}
              index={idx}
              viewMode="list"
              onStarUpdate={handleStarUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
