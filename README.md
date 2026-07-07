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
- [x] Week 3 — Property search endpoint with filters, pagination & indexes
- [ ] Week 4 — Property detail & open house endpoints

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

## API Endpoints

### `GET /api/health`
Returns `{ "status": "ok", "database": "connected" }` when the DB is reachable.

### `GET /api/properties`
Paginated, filterable property search.

Query parameters:
- `city` — case-insensitive match on city name
- `zipcode` — exact ZIP match
- `minPrice`, `maxPrice` — numeric price bounds
- `beds` — minimum number of bedrooms
- `baths` — minimum number of bathrooms
- `limit` — page size, 1–100 (default 20)
- `offset` — records to skip (default 0)

Response shape:
```json
{ "total": 87, "limit": 20, "offset": 0, "results": [...] }
```

Invalid inputs return HTTP 400 with an explanatory message.

## Environment Variables
The backend reads from a `backend/.env` file (not committed). Required keys:
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`.

## Note on Data
Raw SQL/CSV data files are intentionally excluded from this repository per project guidelines.
