# RetailMind AI 🧠

**AI-powered retail market intelligence copilot** — demand forecasting, pricing intelligence, competitor analysis, and market chat powered by Meta Llama 3.1 and live web data.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + Auth | Supabase |
| AI Model | Meta Llama 3.1 8B Instruct (HuggingFace) |
| Live Market Data | SerpAPI |
| Styling | Tailwind CSS |
| Deployment | vercel |

---

## ⚙️ Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your keys in `.env.local`:
- **Supabase**: Create project at https://supabase.com → Project Settings → API
- **HuggingFace**: Get token at https://huggingface.co/settings/tokens (request access to `meta-llama/Llama-3.1-8B-Instruct`)
- **SerpAPI**: Free tier at https://serpapi.com (100 searches/month)

### 3. Set up Supabase database
- Go to your Supabase project → SQL Editor
- Copy and run the contents of `supabase-schema.sql`

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## 🗂️ Project Structure

```
retailmind-ai/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   └── signup/page.jsx
│   ├── (dashboard)/
│   │   ├── layout.jsx          ← Sidebar navigation
│   │   ├── dashboard/page.jsx  ← Overview + quick actions
│   │   ├── chat/page.jsx       ← AI market Chat
│   │   ├── analyze/
│   │   │   ├── demand/page.jsx ← Demand forecasting
│   │   │   └── pricing/page.jsx← Pricing intelligence
│   │   └── reports/page.jsx    ← Saved analyses
│   ├── api/
│   │   ├── chat/route.js
│   │   ├── analyze/demand/route.js
│   │   └── analyze/pricing/route.js
│   ├── layout.jsx
│   ├── globals.css
│   └── page.jsx                ← Landing page
├── lib/
│   ├── supabase.js             ← Browser Supabase client
│   ├── supabaseServer.js       ← Server Supabase client
│   ├── huggingface.js          ← Llama 3.1 API wrapper
│   └── serp.js                 ← SerpAPI live search
├── middleware.js               ← Route protection
├── supabase-schema.sql         ← Run this in Supabase
├── render.yaml                 ← Render deployment config
└── .env.example                ← Environment variable template
```



## ✨ Features

- **AI Market Chat** — Ask anything about retail trends with live web-grounded answers
- **Demand Analyzer** — Get demand scores, trend direction, seasonality, and AI recommendations
- **Pricing Intelligence** — Compare your price vs market, get competitor insights and suggested pricing
- **Saved Reports** — All analyses auto-saved and viewable in your dashboard
- **Auth** — Supabase email auth with protected routes

---

## 📝 Notes

- HuggingFace free tier has rate limits. If you hit limits, wait a few minutes or upgrade your plan.
- SerpAPI free tier = 100 searches/month. The app caches responses for 1 hour to conserve quota.
- All data is user-scoped via Supabase Row Level Security (RLS).
