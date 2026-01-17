# Deploying Katha to Netlify

This project is configured for deployment on Netlify. Since it consists of a React frontend and a FastAPI backend, you will need to host them separately.

## 1. Hosting the Frontend (Netlify)

The `frontend/` directory contains all the Necessary configuration (`netlify.toml`) for a smooth deployment.

### Steps:
1.  **Push to GitHub**: Ensure your latest code is on GitHub.
2.  **Log in to Netlify**: Go to [netlify.com](https://www.netlify.com/) and log in.
3.  **Add New Site**: Click "Add new site" -> "Import an existing project".
4.  **Connect GitHub**: Select your repository (`katha-smart-storyteller`).
5.  **Configure Build Settings**:
    *   **Base directory**: `frontend`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  **Environment Variables**:
    *   Click "Show advanced" or go to "Site settings" -> "Environment variables" after creation.
    *   Add `VITE_API_BASE_URL`: This should be the URL where your backend is hosted (e.g., `https://katha-backend.onrender.com/api`).
    *   *Note: If you haven't deployed the backend yet, you can leave this blank or point to a placeholder, but the app won't fetch data.*
7.  **Deploy**: Click "Deploy site".

## 2. Hosting the Backend (Render / Railway / Heroku)

Netlify is optimized for static sites and serverless functions. For a standardized Python FastAPI backend, services like **Render**, **Railway**, or **Heroku** are recommended.

### Example: Deploying to Render
1.  Create a `render.yaml` or connect your repo manually.
2.  **Root Directory**: `backend`
3.  **Build Command**: `pip install -r requirements.txt`
4.  **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables**: Add any secrets (database URL, API keys) defined in your `.env`.

## 3. Connecting them
Once the backend is live (e.g., `https://your-backend.onrender.com`), go back to your Netlify dashboard for the frontend:
1.  Go to **Site configuration** > **Environment variables**.
2.  Edit `VITE_API_BASE_URL` to match your backend URL (folder path included if needed, e.g., `.../api`).
3.  Trigger a new deploy for the frontend to pick up the change.
