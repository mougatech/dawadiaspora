-- ============================================
-- dawadiaspora.com - Schéma initial de base de données
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- pour gen_random_uuid()

-- ============ LANGUES ============
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) UNIQUE NOT NULL,      -- 'en', 'ar', 'fr', 'rw', 'sw'
    name VARCHAR(50) NOT NULL,            -- 'English', 'العربية', 'Français'...
    is_rtl BOOLEAN DEFAULT FALSE
);

INSERT INTO languages (code, name, is_rtl) VALUES
    ('en', 'English', FALSE),
    ('ar', 'العربية', TRUE),
    ('fr', 'Français', FALSE),
    ('rw', 'Kinyarwanda', FALSE),
    ('sw', 'Kiswahili', FALSE);

-- ============ UTILISATEURS ============
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    preferred_language_id INTEGER REFERENCES languages(id) DEFAULT 1,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ COURS ============
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    language_id INTEGER REFERENCES languages(id) NOT NULL, -- langue ENSEIGNÉE
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    price NUMERIC(10,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Titres/descriptions du cours, traduits selon la langue d'INTERFACE
CREATE TABLE course_translations (
    id SERIAL PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    interface_language_id INTEGER REFERENCES languages(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE(course_id, interface_language_id)
);

-- ============ LEÇONS ============
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(255) NOT NULL
);

-- Contenu média d'une leçon (peut avoir PDF + audio + vidéo)
CREATE TABLE lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('pdf', 'audio', 'video')),
    file_url TEXT NOT NULL,
    duration_seconds INTEGER
);

-- ============ ACHATS & ABONNEMENTS ============
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    stripe_payment_id VARCHAR(255),
    purchased_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(20) CHECK (plan IN ('monthly', 'yearly')),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'expired')),
    started_at TIMESTAMPTZ DEFAULT now(),
    current_period_end TIMESTAMPTZ
);

-- ============ PROGRESSION (déblocage leçon par leçon) ============
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'completed')),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, lesson_id)
);

-- ============ FAQ (Questions/Réponses) ============
CREATE TABLE faq_items (
    id SERIAL PRIMARY KEY,
    category VARCHAR(10) NOT NULL CHECK (category IN ('audio', 'video', 'pdf')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faq_translations (
    id SERIAL PRIMARY KEY,
    faq_item_id INTEGER REFERENCES faq_items(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer_text TEXT,
    UNIQUE(faq_item_id, language_id)
);

CREATE TABLE faq_content (
    id SERIAL PRIMARY KEY,
    faq_item_id INTEGER REFERENCES faq_items(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) NOT NULL,
    file_url TEXT NOT NULL
);

-- ============ DONS ============
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- don anonyme possible
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_id VARCHAR(255),
    donated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ INDEX UTILES ============
CREATE INDEX idx_courses_language ON courses(language_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lesson_content_lesson ON lesson_content(lesson_id);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_faq_translations_item ON faq_translations(faq_item_id);
