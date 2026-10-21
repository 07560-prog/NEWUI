-- ==============================================================================
-- VIBE UI - SUPABASE DATABASE SCHEMA & MIGRATIONS
-- Aesthetic: Japanese Editorial Minimalism UI Repository
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  is_banned BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. VIBES (UI Projects) TABLE
CREATE TABLE IF NOT EXISTS public.vibes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  html_code TEXT NOT NULL,
  css_code TEXT DEFAULT '',
  js_code TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}'::TEXT[],
  category TEXT DEFAULT 'Minimal' NOT NULL,
  star_count INTEGER DEFAULT 0 NOT NULL,
  avg_rating NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
  rating_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vibe_id UUID REFERENCES public.vibes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_vibe_rating UNIQUE (vibe_id, user_id)
);

-- 6. STARS (Bookmarks) TABLE
CREATE TABLE IF NOT EXISTS public.stars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vibe_id UUID REFERENCES public.vibes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_vibe_star UNIQUE (vibe_id, user_id)
);

-- 7. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vibe_id UUID REFERENCES public.vibes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vibes_user_id ON public.vibes(user_id);
CREATE INDEX IF NOT EXISTS idx_vibes_category ON public.vibes(category);
CREATE INDEX IF NOT EXISTS idx_vibes_star_count ON public.vibes(star_count DESC);
CREATE INDEX IF NOT EXISTS idx_vibes_avg_rating ON public.vibes(avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_vibes_created_at ON public.vibes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vibes_featured ON public.vibes(is_featured);

CREATE INDEX IF NOT EXISTS idx_ratings_vibe ON public.ratings(vibe_id);
CREATE INDEX IF NOT EXISTS idx_stars_vibe ON public.stars(vibe_id);
CREATE INDEX IF NOT EXISTS idx_comments_vibe ON public.comments(vibe_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);

-- ==============================================================================
-- TRIGGERS & STORED PROCEDURES
-- ==============================================================================

-- A. Trigger: Auto-create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, bio, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'bio', 'Minimalist UI Enthusiast'),
    'user'::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Trigger: Recalculate average rating and rating count
CREATE OR REPLACE FUNCTION public.update_vibe_stats_on_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_vibe_id UUID;
  new_avg NUMERIC(3, 2);
  new_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_vibe_id := OLD.vibe_id;
  ELSE
    target_vibe_id := NEW.vibe_id;
  END IF;

  SELECT COALESCE(AVG(rating), 0.0), COUNT(id)
  INTO new_avg, new_count
  FROM public.ratings
  WHERE vibe_id = target_vibe_id;

  UPDATE public.vibes
  SET 
    avg_rating = new_avg,
    rating_count = new_count,
    updated_at = timezone('utc'::text, now())
  WHERE id = target_vibe_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_rating_stats ON public.ratings;
CREATE TRIGGER trigger_update_rating_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_vibe_stats_on_rating();

-- C. Trigger: Recalculate star count
CREATE OR REPLACE FUNCTION public.update_vibe_stars_on_star()
RETURNS TRIGGER AS $$
DECLARE
  target_vibe_id UUID;
  new_stars INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_vibe_id := OLD.vibe_id;
  ELSE
    target_vibe_id := NEW.vibe_id;
  END IF;

  SELECT COUNT(id)
  INTO new_stars
  FROM public.stars
  WHERE vibe_id = target_vibe_id;

  UPDATE public.vibes
  SET 
    star_count = new_stars,
    updated_at = timezone('utc'::text, now())
  WHERE id = target_vibe_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_star_count ON public.stars;
CREATE TRIGGER trigger_update_star_count
  AFTER INSERT OR DELETE ON public.stars
  FOR EACH ROW EXECUTE FUNCTION public.update_vibe_stars_on_star();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile, Admins can update all" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- VIBES POLICIES
CREATE POLICY "Public vibes are viewable by everyone" 
  ON public.vibes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create vibes" 
  ON public.vibes FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authors or Admins can update vibes" 
  ON public.vibes FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authors or Admins can delete vibes" 
  ON public.vibes FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- RATINGS POLICIES
CREATE POLICY "Ratings viewable by everyone" 
  ON public.ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ratings" 
  ON public.ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own rating" 
  ON public.ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users or Admins can delete ratings" 
  ON public.ratings FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- STARS POLICIES
CREATE POLICY "Stars viewable by everyone" 
  ON public.stars FOR SELECT USING (true);

CREATE POLICY "Authenticated users can toggle stars" 
  ON public.stars FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can remove their own star" 
  ON public.stars FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- COMMENTS POLICIES
CREATE POLICY "Comments viewable by everyone" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can write comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authors or Admins can delete comments" 
  ON public.comments FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- SAMPLE SEED DATA (For Immediate Demonstration)
-- ==============================================================================
-- Note: Replace mock user IDs with real auth user UUIDs after first signup,
-- or run the app with the included built-in mock fallback layer!
