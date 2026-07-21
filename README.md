# IDX Exchange — Property Search Application

A Zillow/Redfin-style property search app backed by real MLS data, built as part of the IDX Exchange SDE internship.

## Project Objective
Build a full-stack property search experience: a React frontend, a Node/Express REST API, and a MySQL database populated from MLS data.

## Tech Stack
- Frontend: React (Create React App)
- Backend: Node.js + Express
- Database: MySQL 8 (Docker)

## Status
- [x] Week 1 — Environment setup & database import
- [x] Week 2 — Backend foundation + REST API (Express server + /api/health)
- [x] Week 3 — Property search endpoint with filters, pagination & indexes
- [x] Week 4 — Property detail & open house endpoints + request-logging middleware
- [x] Week 5 — React frontend with property listings grid
- [ ] Week 6 — Filter UI + unit tests

## How to Run

Start the database:
    docker start idx-mysql-local

Start the backend (port 5001):
    cd backend
    npm install
    npm run dev

Start the frontend (port 3000):
    cd frontend
    npm install
    npm start

The React app proxies /api/* requests to the backend on port 5001.

## Architecture

React (3000) -> Express API (5001) -> MySQL (3306, Docker)

React never talks to MySQL directly; all data flows through the Express API.

## API Endpoints

GET /api/health — returns { "status": "ok", "database": "connected" } when the DB is reachable.

GET /api/properties — paginated, filterable property search.
Query parameters: city, zipcode, minPrice, maxPrice, beds, baths, limit (1-100, default 20), offset (default 0).
Response shape: { "total": N, "limit": N, "offset": N, "results": [...] }.
Invalid inputs return HTTP 400.

GET /api/properties/:id — returns a single property by listing ID.
200 for success, 400 for malformed ID, 404 if not found.

GET /api/properties/:id/openhouses — returns a JSON array of open house events for the given listing (may be empty).
200 for success, 400 for malformed ID, 404 for missing listing (including orphaned open-house records).

## Middleware
Every request is logged with method, URL, status code, and duration in ms.
Example: GET /api/properties/1000291026 200 12.4ms

## Environment Variables
The backend reads from a backend/.env file (not committed). Required keys:
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, PORT.

## Note on Data
Raw SQL/CSV data files are intentionally excluded from this repository per project guidelines.
