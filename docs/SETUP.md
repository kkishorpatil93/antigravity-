# AgroPulse AI: Local Development Setup Guide

This guide details the complete local setup instructions for running the **AI-Powered Agriculture Crop Advisory Assistant**.

---

## 1. Prerequisites

- **Node.js**: v20+ LTS (Tested on v26.x and v20.x)
- **npm**: v10+
- **Supabase Account**: A free Supabase project with PostgreSQL and Auth.
- **Google AI Studio Account**: A valid Google Gemini API Key.

---

## 2. Environment Variables Configuration

### 2.1 Backend (`backend/.env`)

Copy the example file:
```bash
cp backend/.env.example backend/.env
```

Populate the required credentials:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Supabase Credentials (Found in Supabase Project Settings -> API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJh...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJh...your_service_role_key

# Google Gemini API Configuration (Google AI Studio)
GEMINI_API_KEY=AIzaSy...your_gemini_key
GEMINI_MODEL=gemini-2.5-flash

# Operational Limits
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=60
MAX_IMAGE_SIZE_MB=5
```

### 2.2 Frontend (`frontend/.env`)

Copy the example file:
```bash
cp frontend/.env.example frontend/.env
```

Populate:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...your_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 3. Database Migration Setup (Supabase)

1. Open your Supabase Dashboard $\rightarrow$ **SQL Editor**.
2. Open the file `supabase/migrations/20260101000000_init_agropulse_schema.sql` located in this project.
3. Paste the entire SQL script and click **Run**.
4. This script executes:
   - Enables `pgcrypto` extension.
   - Creates `farmer_profiles`, `advisories`, `disease_analyses`, `chat_conversations`, and `chat_messages` tables.
   - Creates foreign keys, cascading rules, and performance indexes.
   - Creates the `on_auth_user_created` trigger that auto-initializes the farmer profile upon sign-up.
   - Enables **Row Level Security (RLS)** on all tables.
   - Configures the private storage bucket `crop-images` with RLS policies restricting file access to the uploading user (`auth.uid() = {user_id}`).

---

## 4. Installing Dependencies

Run from the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 5. Starting Development Servers

In terminal 1 (Backend):
```bash
cd backend
npm run dev
```
The server will initialize on `http://localhost:5000` and confirm healthy connection to Gemini AI and Supabase.

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
The client will launch on `http://localhost:5173`.

---

## 6. Verifying the System

1. Open `http://localhost:5173`.
2. Click **Create Account** and register with an email and password.
3. Fill in your farm details (e.g., Mandya, Karnataka, Red Soil, Drip Irrigation).
4. Launch any of the 4 advisory engines or ask questions in the 24/7 AI Farming Chatbot.
5. Toggle between English and ಕನ್ನಡ to verify complete bilingual support.

