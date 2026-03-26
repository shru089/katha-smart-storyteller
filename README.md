
# Katha - Smart Cultural Storyteller

An interactive storytelling platform that brings ancient Indian epics to life with AI-powered features, immersive narration, and gamification.

## 🌟 Features

- 📚 **Interactive Chapter Reader** - Immersive reading experience with AI-generated visuals
- 🎧 **AI Audiobooks** - Character-specific voice narration with emotional depth
- 🎬 **Fast Visuals** - Instant AI-generated scene illustrations
- 🗺️ **Interactive Epic Map** - Geographic visualization of epic journeys
- 🏆 **Gamification** - XP system, streaks, and unlockable badges
- 👤 **User Profiles** - Track reading progress and achievements

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file with your configuration
# (See .env.example for required variables)

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 2000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:2000`
- API Docs: `http://localhost:2000/docs`

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL databases with Python type annotations
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client

### AI Services
- **ElevenLabs / Edge TTS** - Voice narration
- **Pollinations.ai** - Image generation
- **Stable Video Diffusion** (Planned) - Video generation

## 📁 Project Structure

```
katha-smart-storyteller/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── scripts/          # Utility scripts
│   ├── static/           # Static assets
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API client
│   │   └── utils/        # Utilities
│   └── package.json
└── README.md
```

## 🎯 Roadmap

### Phase 2 (Upcoming)
- 🎬 **Cinematic Video Reels** - High-quality video generation for scenes
- 🌐 **Multi-lingual Support** - Hindi and Sanskrit translations
- 🤖 **AI Oracle (Rishi)** - Interactive chatbot for story questions
- 📱 **PWA Support** - Offline reading capabilities

## 📄 License

MIT

## 🙏 Acknowledgments

Built with love for preserving and modernizing ancient Indian cultural heritage.
