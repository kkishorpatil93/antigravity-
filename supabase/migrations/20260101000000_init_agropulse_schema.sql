-- Supabase PostgreSQL Migration for AI-Powered Agriculture Crop Advisory Assistant
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Farmer Profiles
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en'
        CHECK (preferred_language IN ('en', 'kn')),
    farming_experience_years INTEGER
        CHECK (farming_experience_years >= 0),
    farm_area NUMERIC
        CHECK (farm_area > 0),
    farm_area_unit TEXT
        CHECK (farm_area_unit IN ('acres', 'hectares', 'guntas')),
    soil_type TEXT,
    irrigation_type TEXT,
    farming_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Agricultural Advisories
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    advisory_type TEXT NOT NULL
        CHECK (
            advisory_type IN (
                'crop_recommendation',
                'disease_detection',
                'fertilizer',
                'irrigation',
                'chat'
            )
        ),
    title TEXT NOT NULL,
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    language TEXT NOT NULL DEFAULT 'en'
        CHECK (language IN ('en', 'kn')),
    model_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Disease Analysis Table
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    advisory_id UUID REFERENCES public.advisories(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    image_path TEXT,
    symptoms TEXT,
    result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Chat Conversations
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Farming Assistant',
    language TEXT NOT NULL DEFAULT 'en'
        CHECK (language IN ('en', 'kn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL CHECK (length(content) <= 10000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS advisories_user_created_idx
    ON public.advisories(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS advisories_type_idx
    ON public.advisories(user_id, advisory_type);

CREATE INDEX IF NOT EXISTS disease_analyses_user_created_idx
    ON public.disease_analyses(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS chat_conversations_user_created_idx
    ON public.chat_conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS chat_messages_conversation_created_idx
    ON public.chat_messages(conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS chat_messages_user_idx
    ON public.chat_messages(user_id);

-- Updated Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS tr_farmer_profiles_updated_at ON public.farmer_profiles;
CREATE TRIGGER tr_farmer_profiles_updated_at
    BEFORE UPDATE ON public.farmer_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_advisories_updated_at ON public.advisories;
CREATE TRIGGER tr_advisories_updated_at
    BEFORE UPDATE ON public.advisories
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER tr_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Automatic Profile Creation Trigger on Supabase Auth SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    raw_full_name TEXT;
    raw_language TEXT;
BEGIN
    raw_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    raw_language := COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en');
    
    IF raw_language NOT IN ('en', 'kn') THEN
        raw_language := 'en';
    END IF;

    INSERT INTO public.farmer_profiles (
        id,
        full_name,
        preferred_language,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        raw_full_name,
        raw_language,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Farmer Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.farmer_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.farmer_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.farmer_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON public.farmer_profiles FOR DELETE
    USING (auth.uid() = id);

-- Advisories Policies
CREATE POLICY "Users can view own advisories"
    ON public.advisories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own advisories"
    ON public.advisories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own advisories"
    ON public.advisories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own advisories"
    ON public.advisories FOR DELETE
    USING (auth.uid() = user_id);

-- Disease Analyses Policies
CREATE POLICY "Users can view own disease analyses"
    ON public.disease_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease analyses"
    ON public.disease_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own disease analyses"
    ON public.disease_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- Chat Conversations Policies
CREATE POLICY "Users can view own chat conversations"
    ON public.chat_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat conversations"
    ON public.chat_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat conversations"
    ON public.chat_conversations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat conversations"
    ON public.chat_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users can view messages from own conversations"
    ON public.chat_messages FOR SELECT
    USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.chat_conversations
            WHERE chat_conversations.id = chat_messages.conversation_id
            AND chat_conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages into own conversations"
    ON public.chat_messages FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.chat_conversations
            WHERE chat_conversations.id = chat_messages.conversation_id
            AND chat_conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own messages"
    ON public.chat_messages FOR DELETE
    USING (auth.uid() = user_id);

-- STORAGE BUCKET CONFIGURATION (for Supabase Storage)
-- Insert private bucket crop-images if not present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'crop-images',
    'crop-images',
    false,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies
CREATE POLICY "Users can upload crop images to their own directory"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'crop-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own uploaded crop images"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'crop-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own uploaded crop images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'crop-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

