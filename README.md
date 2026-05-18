# 🕉️ Katha — Smart Cultural Storyteller

<div align="center">

![Katha Banner](https://pollinations.ai/p/cinematic%20painting%20of%20katha%20logo%20ancient%20indian%20storytelling%20platform%20dark%20saffron%20aesthetic?width=1200&height=400&nologo=true)

**Bringing Ancient Indian Epics to Life for the Gen Z Digital Native Generation.**

[![React](https://img.shields.io/badge/Frontend-React%2018%20+%20TypeScript-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://python.org/)
[![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-shru089-181717?style=flat-square&logo=github)](https://github.com/shru089/katha-smart-storyteller)

*"The journey of a thousand miles begins with a single step" — and Katha is that first step towards preserving our cultural heritage for the digital age.*

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Demo & Screenshots](#-demo--screenshots)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [AI Pipeline](#-ai-pipeline)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Gamification System](#-gamification-system)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🌟 About the Project

**Katha** is an immersive, AI-powered cultural storytelling platform designed to bridge the gap between Gen Z digital natives and the timeless wisdom of ancient Indian epics — the Ramayana, Mahabharata, and Bhagavad Gita.

### The Problem
Today's youth face a growing disconnect from cultural heritage:
- Traditional text-based scriptures fail to engage modern attention spans
- Archaic Sanskrit and classical translations create language barriers
- Static reading doesn't leverage modern multimedia capabilities
- Younger generations find it difficult to connect with ancient narratives

### The Solution
Katha transforms scripture exploration into an **immersive gaming-like main quest** by combining:
- 🎮 **RPG-style gamification** (XP, streaks, archetypes, badges)
- 🎙️ **Emotion-aware AI narration** (ElevenLabs + Edge-TTS fallback)
- 🎬 **AI-generated visual reels** (Pollinations Flux AI)
- 🗺️ **Interactive sacred geography map** (Leaflet.js)
- 📱 **Mobile-first dark aesthetic** (glassmorphism, saffron palette)

---

## ✨ Key Features

### 📚 Interactive Gen Z Storytelling Mode
Stories are rewritten using gaming vocabulary and relatable analogies. The Bhagavad Gita is framed as Arjuna experiencing "tournament burnout" and Krishna dropping the "ultimate spiritual cheat code" — making ancient wisdom immediately accessible.

### 🏆 Gamification & RPG Progression System
- **Archetype Personalization** — Personality quiz assigns users a cultural role: Warrior, Sage, Seeker, or Guardian
- **XP & Streaks** — Completing scenes awards experience points and maintains daily reading streaks
- **Dynamic Badge Engine** — Unlock badges like "Sita's Grace" and "Hanuman's Devotion" stored in SQLite
- **Level Progression** — Tiered advancement from Scholar → Devotee → Legend

### 🎙️ Theatrical AI Narration Pipeline
- **ElevenLabs v2 API** — Multilingual cinematic voice models with 9 Rasa (emotion) mappings
- **Dialogue Voice Parsing** — Automatically extracts character dialogues (`Krishna: ... Arjuna: ...`)
- **Edge-TTS Fallback** — Zero-cost, zero-latency local speech synthesis when ElevenLabs unavailable
- **Pydub Audio Processing** — Segment concatenation with decibel normalization

### 🎬 AI Visual Reels
- **Pollinations Flux Realism** — Prompt-engineered 4K cyberpunk/hyper-realistic mythological images
- **9:16 Vertical Format** — Mobile-first cinematic reel cards with full-screen modal
- **Emotion-Based Prompts** — Visuals tailored to the Rasa (Veera, Shanta, Karuna, etc.) of each scene

### 🗺️ Interactive Sacred Geography Map
- **Leaflet.js** — Real-world coordinate mapping of Ayodhya, Kurukshetra, Lanka, Dwarka
- **Historical Timelines** — Epoch and era details for each sacred location
- **Dark Tile Layer** — CartoCD dark-mode map aesthetics

### 🤖 AI Oracle — "Rishi" Chatbot
An AI companion that answers questions about story symbolism, cultural context, and philosophical teachings directly within the reading experience.

---

## 🖼️ Demo & Screenshots

| Home Dashboard (Gita 101) | AI Reels Player (Cyberpunk Art) |
|:-:|:-:|
| ![Home Dashboard](./screenshots/gita_details_page.png) | ![AI Reels Player](./screenshots/cyberpunk_visual_reel.png) |

> 🔗 **Live Demo**: [katha.vercel.app](https://github.com/shru089/katha-smart-storyteller) (deploy via Vercel + Render)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Reader  │  │   Map    │  │  Reels   │  │ Profile  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API / Axios
┌─────────────────────────────▼───────────────────────────────┐
│                  FastAPI Backend (Python 3.11)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Auth Router │  │Story Router │  │  AI Orchestrator    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         SQLite + SQLModel (ORM Layer)                │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
┌──────────▼──────────┐          ┌────────────▼────────────┐
│  ElevenLabs TTS API │          │  Pollinations Flux AI   │
│  Edge-TTS (fallback)│          │  (Image Generation)     │
└─────────────────────┘          └─────────────────────────┘
```

### Data Flow
```
User Action → React Frontend → FastAPI Router → SQLModel ORM → SQLite DB
                                    ↓
                            AI Service Layer
                         (ElevenLabs / Edge-TTS / Pollinations)
                                    ↓
                         Static File Storage (audio/, videos/)
                                    ↓
                            JSON Response → Frontend UI
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 18 + TypeScript + Vite | Reactive SPA with type safety |
| **Styling** | TailwindCSS + Custom CSS (HSL) | Dark mode, glassmorphism, saffron palette |
| **Animation** | Framer Motion | Page transitions, scroll animations |
| **Routing** | React Router v6 | Client-side navigation with auth guards |
| **HTTP Client** | Axios + JWT Interceptors | API calls with auto-auth refresh |
| **Maps** | Leaflet + React-Leaflet | Interactive sacred geography |
| **Backend** | FastAPI (Python 3.11) | Async REST API with OpenAPI docs |
| **ORM** | SQLModel + SQLAlchemy | Type-safe database interactions |
| **Database** | SQLite | Serverless relational storage (MVP) |
| **AI Audio** | ElevenLabs v2 Multilingual | Cinematic emotion-aware narration |
| **AI Fallback** | Microsoft Edge TTS | Zero-cost local speech synthesis |
| **Audio Processing** | Pydub | MP3 concatenation, volume normalization |
| **AI Images** | Pollinations Flux Realism | Prompt-engineered scene visuals |
| **Auth** | JWT (python-jose) | Stateless authentication |
| **Containerization** | Docker + docker-compose | Reproducible environments |
| **Deployment** | Render (backend) + Vercel (frontend) | Cloud hosting |

---

## 📂 Project Structure

```
katha-smart-storyteller/
├── backend/
│   ├── app/
│   │   ├── api/                  # REST endpoint routers
│   │   │   ├── users.py          # Auth, registration, profile
│   │   │   ├── stories.py        # Story CRUD + search
│   │   │   ├── chapters.py       # Chapter management
│   │   │   ├── scenes.py         # Scene + AI generation
│   │   │   ├── audio.py          # Narration pipeline
│   │   │   └── debug.py          # Seeding, dev utilities
│   │   ├── services/
│   │   │   ├── elevenlabs_service.py   # ElevenLabs integration
│   │   │   ├── enhanced_audio_service.py # Dialogue parsing + audio
│   │   │   ├── fast_video_service.py   # Image generation pipeline
│   │   │   ├── gamification_service.py # XP, badges, streaks
│   │   │   └── seed_service.py         # Sample data seeding
│   │   ├── models.py             # SQLModel table definitions
│   │   ├── db.py                 # Database session management
│   │   └── main.py               # FastAPI app + CORS + routers
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # MobileLayout, BottomNavbar
│   │   │   ├── story/            # StoryHeader, StoryHero, StoryBody
│   │   │   ├── reel/             # AudioControl, RasaPanel, RishiChat
│   │   │   ├── map/              # Map, MapPin, InfoPanel
│   │   │   ├── profile/          # ProfileHeader, StatsGrid, EditForm
│   │   │   └── achievements/     # JourneyHeader, BadgeGrid
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Main dashboard
│   │   │   ├── ChapterReader.tsx # Immersive novel+webtoon reader
│   │   │   ├── SceneViewer.tsx   # Full-screen scene + audio
│   │   │   ├── ReelsPage.tsx     # AI video reel feed
│   │   │   ├── MapPage.tsx       # Interactive sacred map
│   │   │   ├── ArchetypeQuiz.tsx # Personality quiz
│   │   │   └── ProfilePage.tsx   # User profile + achievements
│   │   ├── api/
│   │   │   └── client.ts         # Axios instance + typed API calls
│   │   └── utils/
│   │       ├── readingProgress.ts # LocalStorage progress tracking
│   │       └── notifications.tsx  # Toast achievement system
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── docs/
│   ├── project_report.md         # Formal academic report
│   └── project_diagrams.md       # Mermaid architecture diagrams
├── docker-compose.yml            # Local full-stack launch
├── render.yaml                   # Render.com deploy blueprint
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python **3.11+**
- Node.js **18+**
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/shru089/katha-smart-storyteller.git
cd katha-smart-storyteller
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional for AI features)
cp .env.example .env
# Set ELEVENLABS_API_KEY, JWT_SECRET_KEY in .env

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8081 --reload
```

API available at: `http://localhost:8081`  
Interactive docs: `http://localhost:8081/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API endpoint
cp .env.example .env
# VITE_API_BASE_URL is pre-configured for local dev via Vite proxy

# Start dev server
npm run dev
```

App available at: `http://localhost:5173`

### 4. Seed Sample Data
In the running frontend, click **"Seed Data"** on the Home page (dev mode only), or:

```bash
curl -X POST http://localhost:8081/api/debug/seed-data?reset=true
```

### 5. Quick Start with Docker
```bash
# Full stack in one command
docker-compose up --build

# Frontend: http://localhost:5173
# Backend:  http://localhost:2000
```

---

## ☁️ Deployment

### Option 1: Render + Vercel (Recommended)

**Backend → Render.com**
1. Fork this repo to your GitHub
2. Sign up at [render.com](https://render.com/) → Blueprints → New Blueprint
3. Connect your repository — Render auto-detects `render.yaml`
4. Set environment variables:
   - `ELEVENLABS_API_KEY` — your ElevenLabs key (optional)
   - `CORS_ORIGINS` — your Vercel frontend URL
5. Click **Apply** and wait

**Frontend → Vercel**
1. Sign up at [vercel.com](https://vercel.com/) → Add New Project
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Set environment variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com/api`
5. Click **Deploy**

### Option 2: Docker (Self-hosted)
```bash
# Clone and run anywhere with Docker
git clone https://github.com/shru089/katha-smart-storyteller.git
cd katha-smart-storyteller
docker-compose up -d
```

### Option 3: Manual
```bash
# Backend on Railway/Heroku/any PaaS
pip install -r backend/requirements.txt
uvicorn app.main:app

# Frontend on Netlify/AWS S3
cd frontend && npm run build
# Deploy the dist/ folder
```

---

## 🤖 AI Pipeline

### Audio Generation Sequence

```
User triggers narration
       ↓
FastAPI: POST /api/scenes/{id}/generate
       ↓
Parse raw_text for dialogue segments
(Script format: "Krishna: ...", quoted: "'Arjuna said...'")
       ↓
   Is ElevenLabs configured?
   YES → ElevenLabs v2 Multilingual API
          + Rasa emotion mapping (Veera=heroic, Shanta=peaceful, etc.)
   NO  → Edge-TTS (local, zero-cost)
          + Custom rate/pitch per character voice
       ↓
Pydub: concatenate segments + normalize dB
       ↓
Save to static/audio/{scene_id}.mp3
       ↓
Update Scene record (ai_audio_url)
       ↓
Return JSON: { success: true, audio_url: "..." }
```

### Image Generation Sequence

```
Scene visualization request
       ↓
Build prompt: reel_script + scene emotion + cultural modifiers
       ↓
GET https://image.pollinations.ai/prompt/{encoded_prompt}?enhance=true&width=1080&height=1920
       ↓
Save JPEG to static/videos/fast/{scene_id}.jpg
       ↓
Update Scene record (ai_video_url)
```

### Supported Rasas (Emotional Moods)

| Rasa | English | Audio Effect | Visual Style |
|:-----|:--------|:-------------|:-------------|
| Shringara | Love/Romance | Soft, lyrical | Golden warm tones |
| Hasya | Humor/Joy | Light, elevated | Bright, vibrant |
| Karuna | Compassion/Sorrow | Gentle, subdued | Desaturated blues |
| Raudra | Fury/Anger | Deep, powerful | Dark reds |
| Veera | Heroism | Bold, strong | Epic golds |
| Bhayanaka | Fear | Tense, urgent | Dark shadows |
| Adbhuta | Wonder/Amazement | Elevated, breathy | Cosmic purples |
| Shanta | Peace | Calm, slow | Soft greens |
| Bibhatsa | Disgust | Moderate, flat | Muted neutrals |

---

## 🗄️ Database Schema

```
USER ──────────────────── USER_SCENE_PROGRESS ─── SCENE ─── CHAPTER ─── STORY
  │                                                                           │
  └─────────────────────── USER_BADGE ─────────── BADGE          LOCATION
```

**Key Entities:**

| Table | Key Fields |
|:------|:-----------|
| `USER` | id, name, email, password_hash, total_xp, current_streak_days, archetype |
| `STORY` | id, title, slug, category, cover_image_url, total_chapters |
| `CHAPTER` | id, story_id FK, index, title, short_summary |
| `SCENE` | id, chapter_id FK, raw_text, reel_script, ai_emotion, ai_audio_url, ai_video_url |
| `USER_SCENE_PROGRESS` | user_id FK, scene_id FK, completed, xp_earned |
| `BADGE` | id, code (UNIQUE), name, description, unlock_condition |
| `USER_BADGE` | user_id FK, badge_id FK, earned_at |
| `LOCATION` | id, name, description, lat, lon, epoch, era |

---

## 📡 API Documentation

FastAPI auto-generates interactive docs at `/docs`. Key endpoints:

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/users/register` | Create account |
| `POST` | `/api/users/login` | Authenticate, receive JWT |
| `GET` | `/api/users/me` | Current user profile |
| `GET` | `/api/stories/` | List all stories (with category filter) |
| `GET` | `/api/stories/{id}` | Story detail with chapters |
| `GET` | `/api/chapters/{id}/scenes` | All scenes in chapter |
| `POST` | `/api/scenes/{id}/generate` | Trigger AI audio + image generation |
| `POST` | `/api/scenes/{id}/complete` | Mark scene read, award XP |
| `GET` | `/api/locations/` | Sacred geography points |
| `POST` | `/api/debug/seed-data` | Populate sample Ramayana data |

---

## 🎮 Gamification System

### Archetype Quiz Flow
```
User answers 3 questions → scores accumulated per type →
Highest score wins → Archetype saved to DB → Badge + XP awarded
```

| Archetype | Traits | Badge |
|:----------|:-------|:------|
| **Warrior** | Courage, action, duty | Arjuna's Resolve |
| **Sage** | Wisdom, contemplation, knowledge | Vyasa's Pen |
| **Seeker** | Curiosity, discovery, experience | Narada's Veena |
| **Guardian** | Loyalty, protection, tradition | Bhishma's Oath |

### XP System
- Scene completed: **+10 XP**
- Chapter completed: **+50 XP**
- Story completed: **+500 XP**
- Archetype quiz: **+100 XP**
- Daily streak: **+25 XP/day**
- Badge unlocked: **+50 XP**

---

## 🗺️ Future Roadmap

### Phase 2 (Next 3-6 months)
- [ ] **Stable Video Diffusion** — Full-length cinematic scene videos
- [ ] **Hindi/Sanskrit Localization** — Neural machine translation + regional voices
- [ ] **Mobile Apps** — React Native iOS/Android
- [ ] **PWA Offline Mode** — Service workers, cached audio

### Phase 3 (6-12 months)
- [ ] **Rishi AI Oracle** — Full LLM-powered cultural Q&A chatbot
- [ ] **Multiplayer Quests** — Collaborative reading with friends
- [ ] **Creator Marketplace** — Community storytellers submit adaptations
- [ ] **PostgreSQL Migration** — Production-grade persistence + Redis caching

### Phase 4 (12+ months)
- [ ] **VR/AR Experiences** — WebXR mythology immersion
- [ ] **UNESCO Partnership** — Digital preservation initiatives
- [ ] **Expand Epics** — Puranas, Panchatantra, regional folklore

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👩💻 Author

**Shrishti Singh**  
3rd Year B.Tech CSE (AI/ML) | CSMU, Panvel, Navi Mumbai  
AI Minor @ IIT Ropar

[![LinkedIn](https://img.shields.io/badge/LinkedIn-shrishti--singh--455566348-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/shrishti-singh-455566348)
[![GitHub](https://img.shields.io/badge/GitHub-shru089-181717?style=flat-square&logo=github)](https://github.com/shru089)
[![Email](https://img.shields.io/badge/Email-shrishtis089%40gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:shrishtis089@gmail.com)

---

## 📄 License

MIT License — Built with ❤️ to preserve and modernize global cultural heritage.

---

<div align="center">

*🕉️ "Na jayate mriyate va kadacit" — It is never born, nor does it ever die.*  
**Bhagavad Gita 2.20**

</div>