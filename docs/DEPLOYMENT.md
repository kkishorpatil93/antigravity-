# AgroPulse AI: Production Deployment Blueprint

This application is architected for seamless cloud deployment:
- **Frontend**: Vercel or Cloudflare Pages
- **Backend**: Render, Railway, or Google Cloud Run
- **Database & Auth**: Supabase Managed Cloud

---

## 1. Supabase Database Deployment

1. Create a new production project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** $\rightarrow$ execute `supabase/migrations/20260101000000_init_agropulse_schema.sql`.
3. Verify that `crop-images` bucket is created under **Storage**.
4. Retrieve your **Project URL**, **Anon Key**, and **Service Role Key** under **Project Settings $\rightarrow$ API**.

---

## 2. Backend Deployment (e.g. Render / Railway / Cloud Run)

### Deployment on Render:
1. Connect your repository to Render $\rightarrow$ New **Web Service**.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=60
   MAX_IMAGE_SIZE_MB=5
   ```

---

## 3. Frontend Deployment (e.g. Vercel)

1. Connect your repository to Vercel $\rightarrow$ Select `frontend` as Root Directory.
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJh...
   VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
   ```
6. Deploy!

