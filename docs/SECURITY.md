# AgroPulse AI: Security, Privacy & Agricultural Safety Guide

---

## 1. Authentication & Tenant Data Isolation (RLS)

1. **Supabase JWT Verification**:
   - The backend validates every inbound token directly against the Supabase Auth service.
   - User identity (`req.user.id`) is derived strictly from the verified token—never from user-provided body or query parameters.
2. **PostgreSQL Row Level Security (RLS)**:
   - RLS is permanently active on all tables.
   - Every `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rule checks `auth.uid() = user_id`. Cross-user data leakage is physically blocked at the database engine level.
3. **Private Object Storage**:
   - The `crop-images` bucket is private.
   - Only pre-signed URLs with finite expirations (up to 24 hours) are returned to authorized clients.

---

## 2. API & Network Security

1. **Helmet HTTP Headers**:
   - Configures Cross-Origin Resource Policy, disables `x-powered-by`, and enforces strict XSS and clickjacking protections.
2. **CORS Allowlist**:
   - Restricted to trusted frontend domain origins (`FRONTEND_URL` and authorized local development ports).
3. **Rate Limiting**:
   - In-memory rate limiting throttles requests to 60 queries per 15-minute window per IP to protect Gemini API quotas and prevent brute-force attacks.
4. **Input Sanitization & Zod Contracts**:
   - Every route validates incoming payloads against strict Zod schemas before hitting business logic or LLM services. Malformed or oversized inputs are immediately rejected with HTTP 400.
5. **No Stack Trace Leakage**:
   - Centralized error handler masks stack traces in production mode (`NODE_ENV === 'production'`).

---

## 3. Agricultural & AI Safety Directives

1. **Zero Hallucination of Yield or Profits**:
   - System prompts explicitly prohibit guaranteeing crop yields or financial profitability.
2. **Integrated Pest Management (IPM) Hierarchy**:
   - Diseases must always be treated via Cultural $\rightarrow$ Biological $\rightarrow$ Chemical sequentially.
3. **Chemical Safety Withholding Notice**:
   - When chemical interventions are unavoidable, mandatory Pre-Harvest Intervals (PHI) in days and Personal Protective Equipment (PPE) instructions are enforced.
4. **Non-Laboratory Disclaimers**:
   - AI disease diagnostics are explicitly presented as preliminary visual assessments. Physical visits to local Krishi Vigyan Kendras (KVKs) are advised for severe symptoms.

