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
from app.api.routes import users, stories, chapters, scenes, achievements, debug, locations, audio
from app.api.routes import reel
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
app.include_router(debug.router, prefix="/api/debug", tags=["debug"])
app.include_router(locations.router, prefix="/api/locations", tags=["locations"])

# Audio Generation (NEW)
app.include_router(audio.router, prefix="/api", tags=["audio"])

# AI Routes (Only Rishi chat and reel remaining)
app.include_router(reel.router, prefix="/api/ai/reel", tags=["ai-reel"])
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
