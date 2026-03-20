# YYC Track — Docker Compose Guide

> **For the full stack only.** Day-to-day development does not require Docker —
> just `npm run dev` inside your app folder as usual.
> Use Docker when you want to test the frontend and backend running together.

---

## Prerequisites

Before running Docker Compose, make sure you have:

- **Docker Desktop** installed and running on Windows
- **WSL integration enabled** in Docker Desktop:
  - Docker Desktop → Settings → Resources → WSL Integration → enable your Ubuntu distro
- The monorepo cloned inside WSL (`~/projects/yyc-track`)
- Your `.env` files in place (see Environment Variables section below)

---

## Environment Variables

Docker Compose reads from a `.env` file at the **monorepo root** (`yyc-track/.env`).
This file is gitignored — you need to create it manually.

```bash
cd ~/projects/yyc-track
cp .env.example .env
```

Then open `.env` and fill in the real values. Ask a teammate for the credentials
if you don't have them. Never commit the `.env` file to GitHub.

---

## First Time Setup

```bash
# 1. Navigate to the monorepo root
cd ~/projects/yyc-track

# 2. Build the images and start both services
docker compose up --build
```

This will:
- Build the frontend (Vite production build served by nginx)
- Build the backend (Node.js Express API)
- Start both containers on a shared network

Once running:
- **Frontend** → http://localhost:3000
- **Backend**  → http://localhost:5000

---

## Daily Usage

```bash
# Start (no rebuild — uses cached images)
docker compose up

# Start in background so your terminal stays free
docker compose up -d

# Stop everything
docker compose down
```

---

## When to Use --build

Only rebuild when something structural has changed:

| Situation | Command |
|---|---|
| First time running | `docker compose up --build` |
| Changed a Dockerfile | `docker compose up --build` |
| Added/removed a package (package.json changed) | `docker compose up --build` |
| Changed a VITE_ environment variable | `docker compose up --build frontend` |
| Normal restart | `docker compose up` |
| Changed a backend env var | `docker compose down && docker compose up` |

---

## Useful Commands

```bash
# See what containers are running
docker compose ps

# View logs for all services
docker compose logs

# Follow logs in real time
docker compose logs -f

# View logs for one service only
docker compose logs frontend
docker compose logs backend

# Rebuild just one service
docker compose up --build frontend
docker compose up --build backend

# Stop and remove everything including volumes
docker compose down -v
```

---

## Individual Development (No Docker)

For day-to-day work you don't need Docker at all.
Just work inside your app folder as normal:

```bash
# Frontend
cd ~/projects/yyc-track/apps/frontend
npm run dev
# → http://localhost:5173

# Backend
cd ~/projects/yyc-track/apps/backend
npm run dev
# → http://localhost:5000
```

The Azure Functions are already deployed to Azure and always on —
no setup needed to call them:
```
https://yyc-track-functions.azurewebsites.net/api
```

---

## Branch Workflow

```
feature/your-feature
        ↓  open PR
     develop          ← default branch, merge features here
        ↓  open PR (when ready for release)
       main           ← production only, protected
```

- Never push directly to `develop` or `main`
- Always work on a feature branch and open a PR
- All PRs require at least 1 approval before merging

---

## Troubleshooting

### Docker Desktop is not running
```
error during connect: ... Is the docker daemon running?
```
Open Docker Desktop on Windows and wait for it to fully start before retrying.

### Port already in use
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```
Something else is using that port. Find and stop it:
```bash
lsof -i :3000
lsof -i :5000
```

### Frontend build fails — cannot resolve module
A component is being imported that doesn't exist yet (likely from an unmerged PR).
Comment out the import in the relevant file temporarily and rebuild:
```bash
docker compose up --build frontend
```

### Backend cannot connect to MongoDB
Check that:
1. `MONGODB_URI` in your root `.env` is correct
2. Your IP address is whitelisted in MongoDB Atlas
   (Atlas → Network Access → Add IP Address → Add Current IP)

### Changes not showing up
If you changed a `VITE_` env variable or a Dockerfile, you need a rebuild:
```bash
docker compose up --build
```
Regular restarts don't pick up those changes.

### node_modules errors inside Docker
Docker has its own separate `node_modules` inside the container.
If you see module-related errors, do a full rebuild:
```bash
docker compose down
docker compose up --build
```