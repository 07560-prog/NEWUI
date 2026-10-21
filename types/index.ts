export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  is_banned?: boolean;
  created_at: string;
}

export interface Vibe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  js_code: string;
  tags: string[];
  category: VibeCategory;
  star_count: number;
  avg_rating: number;
  rating_count?: number;
  is_featured: boolean;
  views_count?: number;
  created_at: string;
  updated_at: string;
  author?: Profile;
  has_starred?: boolean;
  user_rating?: number;
}

export type VibeCategory = 
  | 'Minimal'
  | 'Cyberpunk'
  | 'Neo-brutalism'
  | 'Glassmorphism'
  | 'Brutalist'
  | 'Retro'
  | 'Interactive'
  | 'Typography';

export interface Rating {
  id: string;
  vibe_id: string;
  user_id: string;
  rating: number; // 1-5
  created_at: string;
}

export interface Star {
  id: string;
  vibe_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  vibe_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
  author?: Profile;
}

export type SortOption = 'starred' | 'rated' | 'newest' | 'trending';
export type ViewMode = 'grid' | 'list';
