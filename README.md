# IDX Exchange — Property Search Application

A Zillow/Redfin-style property search app backed by real MLS data, built as part of the IDX Exchange SDE internship.

## Project Objective
Build a full-stack property search experience: a React frontend, a Node/Express REST API, and a MySQL database populated from MLS data.

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MySQL 8 (Docker)

## Status
- [x] Week 1 — Environment setup & database import
- [x] Week 2 — Backend foundation + REST API (Express server + `/api/health`)
- [ ] Week 3 — Property search endpoint with filters & indexing

## How to Run

### Database (MySQL in Docker)
```bash
docker start idx-mysql-local
```

### Backend (Node/Express)
```bash
cd backend
npm install
npm run dev
```
The API runs on http://localhost:5001 (port 5000 is reserved by macOS AirPlay).

Health check: `GET /api/health` → `{ "status": "ok", "database": "connected" }`

## Environment Variables
The backend reads from a `backend/.env` file (not committed). Required keys:
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`.

## Note on Data
Raw SQL/CSV data files are intentionally excluded from this repository per project guidelines.
