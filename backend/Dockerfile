# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install system dependencies (ffmpeg is needed for audio/video processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port (uses PORT env var; Render sets this automatically)
EXPOSE 8081

# Command to run the application
# PORT is provided by Render/Railway in production; falls back to 8081 locally
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8081}
