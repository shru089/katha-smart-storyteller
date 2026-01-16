# How to Run Katha

## Prerequisites
- Python 3.10+
- Node.js 18+

## 1. Backend Setup
The dependencies are already installed. To start the server:

```bash
cd backend
uvicorn app.main:app --reload
```
Server runs at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

## 2. Frontend Setup
The dependencies are already installed. To start the dev server:

```bash
cd frontend
npm run dev
```
App runs at `http://localhost:5173`.

## 3. Usage
1. Open the frontend.
2. Enter a name to create a user.
3. On the Home screen, click **"Seed Ramayana"** to populate the database with the sample story.
4. Click on the story to view chapters.
5. Click "Open Chapter" to view scenes.
6. Click "Next" to progress through scenes. It will generate AI metadata (mocked or real if keys provided).
7. Check "Achievements" to see your XP and badges.
