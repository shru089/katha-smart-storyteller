# Deployment Guide

This repository is configured for flexible deployment using either **Docker** (recommended for universality) or **Render** (recommended for ease of use).

## Option 1: Render (Recommended Cloud Deployment)

Render allows you to deploy both the backend and frontend easily.

1.  **Fork/Clone** this repository to your GitHub.
2.  Sign up at [render.com](https://render.com/).
3.  Go to **Blueprints** -> **New Blueprint Instance**.
4.  Connect your repository.
5.  Render will automatically detect the `render.yaml` file and set up:
    *   **katha-backend**: A generic web service (FastAPI) running on Python.
    *   **katha-frontend**: A static site (React/Vite).
6.  **Important**: Configured environments:
    *   The frontend will automatically know the backend URL via the `VITE_API_BASE_URL` variable.
7.  Click **Apply** and wait for deployment!

## Option 2: Docker (Run Anywhere)

You can run the entire stack locally or on any server (AWS EC2, DigitalOcean, etc.) with Docker installed.

### Run Locally:
```bash
docker-compose up --build
```
*   Frontend: `http://localhost:5173`
*   Backend: `http://localhost:2000`

### Deploy to Cloud (e.g. AWS/Azure):
Simply clone the repo on your server and run `docker-compose up -d`.

## Option 3: Manual Deployment

*   **Backend**: Can be hosted on Railway, Heroku, or Render using `pip install -r requirements.txt` and `uvicorn app.main:app`.
*   **Frontend**: Can be built with `npm run build` and the `dist` folder deployed to Netlify, Vercel, or AWS S3.
