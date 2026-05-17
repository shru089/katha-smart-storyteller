"""
Katha - Smart Cultural Storyteller
FastAPI Backend with JWT Authentication
"""

import os
import time
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db import create_db_and_tables
from app.api.routes import users, stories, chapters, scenes, achievements, locations, debug, audio
from app.api.routes.ai import rishi

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("katha")


# Lifespan context manager (replaces deprecated on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Startup: Initialize database
    Shutdown: Cleanup resources
    """
    # Startup
    logger.info("🚀 Starting Katha API...")
    create_db_and_tables()
    logger.info("✅ Database tables initialized")

    # Seed default data if empty
    from app.models import Location, User
    from app.auth import hash_password
    from sqlmodel import Session, select
    from app.db import engine
    with Session(engine) as session:
        # 1. Seed Demo User
        demo_email = "demo@katha.com"
        demo_stmt = select(User).where(User.email == demo_email)
        existing_user = session.exec(demo_stmt).first()
        if not existing_user:
            demo_user = User(
                name="Demo Explorer",
                email=demo_email,
                password_hash=hash_password("demo123"),
                username="demo",
                bio="A curious wanderer exploring the timeless epics and culture of India.",
                archetype="Explorer",
                total_xp=250,  # Give them some initial XP to make the profile look good!
                current_streak_days=3
            )
            session.add(demo_user)
            session.commit()
            logger.info("✅ Seeded default demo user (demo@katha.com / demo123)")

        # 2. Seed Sacred Locations
        if not session.exec(select(Location)).first():
            locations_data = [
                Location(name='Kurukshetra', description='The sacred battlefield where the Kurukshetra War of the Mahabharata was fought between the Pandavas and Kauravas. Krishna delivered the Bhagavad Gita to Arjuna here.', lat=29.9695, lon=76.8783, epoch='Mahabharata', region='Northern India', era='3102 BCE'),
                Location(name='Ayodhya', description='The capital of the Kosala Kingdom and birthplace of Lord Rama. A city of divine beauty on the banks of the Sarayu river.', lat=26.7956, lon=82.1942, epoch='Ramayana', region='Northern India', era='5114 BCE'),
                Location(name='Hampi (Kishkindha)', description='Believed to be the site of Kishkindha, the kingdom of the Vanaras. Hanuman and Sugriva helped Rama here in his quest to rescue Sita.', lat=15.3350, lon=76.4600, epoch='Ramayana', region='Southern India', era='Unknown'),
                Location(name='Lanka', description="The mythical island kingdom of Ravana, ruled with great power and splendour. It was here that Sita was held captive until Rama's victory.", lat=7.8731, lon=80.7718, epoch='Ramayana', region='Sri Lanka', era='5114 BCE'),
                Location(name='Dwarka', description='The golden city built by Lord Krishna, said to have been submerged in the sea after his departure from the world.', lat=22.2394, lon=68.9678, epoch='Mahabharata', region='Western India', era='3102 BCE'),
                Location(name='Mathura', description='Birthplace of Lord Krishna. A city with deep roots in the Bhagavata Purana and the childhood stories of Krishna.', lat=27.4924, lon=77.6737, epoch='Puranas', region='Northern India', era='3228 BCE'),
                Location(name='Varanasi (Kashi)', description='One of the oldest living cities in the world. The sacred city of Shiva on the banks of the Ganga, where moksha is attained.', lat=25.3176, lon=82.9739, epoch='Puranas', region='Northern India', era='Ancient'),
                Location(name='Prayagraj (Triveni Sangam)', description='The confluence of the Ganga, Yamuna, and the mythical Saraswati. Site of the Kumbh Mela and the descent of the Ganga from the heavens.', lat=25.4358, lon=81.8463, epoch='Puranas', region='Northern India', era='Ancient'),
            ]
            for loc in locations_data:
                session.add(loc)
            session.commit()
            logger.info(f"✅ Seeded {len(locations_data)} sacred locations")

    yield  # Application runs here
    
    # Shutdown
    logger.info("👋 Shutting down Katha API...")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Katha - Smart Cultural Storyteller",
    description="An interactive storytelling platform that brings cultural stories to life with AI-powered features",
    version="1.0.0",
    lifespan=lifespan
)


# CORS Configuration
# In production, replace with your actual frontend URLs
ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Vite dev server
    "http://localhost:3000",      # Alternative dev port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Add production origins from environment
production_origins = os.getenv("CORS_ORIGINS", "").split(",")
ALLOWED_ORIGINS.extend([origin.strip() for origin in production_origins if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all API requests with timing"""
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Log request
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Duration: {duration:.3f}s"
    )
    
    return response


# Static files setup
def setup_static_files():
    """Setup static file serving with correct path detection"""
    possible_paths = [
        Path("static"),
        Path("backend/static"),
        Path(__file__).parent.parent.parent / "static"
    ]
    
    for static_dir in possible_paths:
        if static_dir.exists():
            logger.info(f"📁 Serving static files from: {static_dir.absolute()}")
            return static_dir
    
    # Create default static directory
    default_dir = Path("static")
    default_dir.mkdir(exist_ok=True)
    (default_dir / "images").mkdir(exist_ok=True)
    (default_dir / "audio").mkdir(exist_ok=True)
    (default_dir / "videos").mkdir(exist_ok=True)
    logger.info(f"📁 Created static directory: {default_dir.absolute()}")
    return default_dir


static_dir = setup_static_files()
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


# API Routes
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(stories.router, prefix="/api/stories", tags=["stories"])
app.include_router(chapters.router, prefix="/api/chapters", tags=["chapters"])
app.include_router(scenes.router, prefix="/api/scenes", tags=["scenes"])
app.include_router(achievements.router, prefix="/api/user", tags=["achievements"])
app.include_router(locations.router, prefix="/api/locations", tags=["locations"])
app.include_router(debug.router, prefix="/api/debug", tags=["debug"])
app.include_router(audio.router, prefix="/api/audio", tags=["audio"])

# AI Routes - Rishi the wise sage
app.include_router(rishi.router, prefix="/api/ai/rishi", tags=["ai-rishi"])


@app.get("/", tags=["health"])
def root():
    """Health check endpoint"""
    return {
        "message": "Katha API is running",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health", tags=["health"])
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "static_files": str(static_dir.absolute())
    }
