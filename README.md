# CampusAI Growth Engine • Build Your First AI Project in 60 Minutes

A high-velocity EdTech growth platform, registration portal, and analytics dashboard built on Google Stitch design exports for the **NxtWave Growth Intern Challenge**.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on v22.17.0)
- **npm**: v9.0.0 or later

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```
Compiles and bundles the frontend with Vite into the `dist/` directory.

### 3. Start the Production Server
```bash
npm start
```
> Server runs on `http://localhost:3000` (or `process.env.PORT` in cloud environments).
> - **Main Web Application**: `http://localhost:3000` (serves compiled `dist/` bundle)
> - **Direct Referral Test URL**: `http://localhost:3000/?screen=registration&ref=NXT-RV-04`
> - **Original Google Stitch Export**: `http://localhost:3000/code.html`
> - **Live Metrics REST API**: `http://localhost:3000/api/kpis`
> - **Registrations REST API**: `http://localhost:3000/api/registrations`
> - **Ambassadors Directory API**: `http://localhost:3000/api/ambassadors`
> - **Health Check Endpoint**: `http://localhost:3000/health`
> - **Dynamic CSV Export**: `http://localhost:3000/api/export-csv`

### 4. Run Automated Test Suite
```bash
npm test
```
Executes all 23 unit, integration, persistence, and HTTP endpoint test suites.

---

## ☁️ Public Cloud Deployment Guide

The CampusAI Growth Engine is a self-contained Node.js web application that requires **no external database credentials** or complex infrastructure setup.

### Recommended Platform: **Render** (Simplest, Free Tier Available)

Render natively supports Node.js web services with automated builds and health check monitoring.

#### Deployment Steps:
1. **Push to GitHub**:
   Initialize a Git repository (if not already done) and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: prepare CampusAI Growth Engine for public deployment"
   git remote add origin https://github.com/<your-username>/campusai-growth-engine.git
   git push -u origin main
   ```
2. **Create New Web Service on Render**:
   - Sign in at [render.com](https://render.com) and click **New → Web Service**.
   - Connect your GitHub repository.
3. **Configure Settings**:
   - **Name**: `campusai-growth-engine`
   - **Environment**: `Node`
   - **Region**: Closest to your target audience (e.g., Singapore / Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - Note: Render automatically assigns and populates `PORT`. The server reads `process.env.PORT` and binds to `0.0.0.0` automatically.
5. **Deploy**:
   - Click **Create Web Service**.
   - Render will build the Vite assets, start the server, and provide a public URL (e.g. `https://campusai-growth-engine.onrender.com`).

---

### Alternative Platform: **Railway**

1. Install Railway CLI: `npm i -g @railway/cli` or use the web dashboard at [railway.app](https://railway.app).
2. Connect your GitHub repository.
3. Railway automatically detects `package.json`:
   - Set Build Command: `npm run build`
   - Set Start Command: `npm start`
4. Deploy and generate a domain under **Settings → Networking → Generate Domain**.

---

## 🛡️ Data Storage & Persistence Architecture

1. **Client Storage (`localStorage`)**:
   - The browser stores registrations in `localStorage` under key `campusai_growth_engine_v2`.
   - Registrations persist across page reloads and browser restarts for that student.
2. **Server Storage (`data/store.json`)**:
   - The Node.js server uses an automatic file-backed persistence adapter saving to `data/store.json`.
   - Whenever a registration is submitted via form or REST API, state is saved to disk immediately.
   - When the server process restarts, existing registrations are reloaded from disk.
   - Requires zero external database credentials, API keys, or cloud secrets.
3. **Frontend-Backend Synchronization**:
   - Form submissions in the browser immediately notify the server's `POST /api/register` endpoint.
   - On page load, `src/app.js` checks `GET /api/registrations` to ensure local state reflects all recorded server registrations.
   - If the server is unreachable or offline, the app falls back seamlessly to `localStorage`.
4. **Multi-Instance / Cloud Scaling Note**:
   - On ephemeral containers without persistent volume mounts, disk files reset if the container is redeployed. For multi-container enterprise deployments, set a `DATABASE_URL` pointing to PostgreSQL or MongoDB Atlas.

---

## 📱 Available Screens & Connected Navigation

1. **Overview (`#overview` or `?screen=overview`)**:
   - Live KPIs: Total Registrations (284 baseline / 500 target), Referral-Driven (146 baseline / 51.4% share), Campaign Expenditure (₹1,120 / ₹2,000 budget), CAC (₹3.94 vs ₹4.00 target).
   - Searchable, filterable registration records stream with CSV export.
   - Clear visual labeling distinguishing simulated demo records (`DEMO DATA`) from live registrants (`LIVE USER SUBMISSION`).
2. **Workshop Registration (`#registration` or `?screen=registration`)**:
   - Exact workshop title: **"Build Your First AI Project in 60 Minutes"**.
   - Input validation (Name, RFC Email regex, 10-digit Indian Mobile, College, Degree/Branch, Graduation Year, Focus Track, Communication Consent).
   - Case-insensitive duplicate email prevention.
   - Unique registration ticket ID generation (`REG-2025-XXXX`).
3. **Ambassador Hub (`#ambassadors` or `?screen=ambassadors`)**:
   - Leaderboard across 18 campus representatives.
   - Referral tracking and automatic link generator.
   - One-click Copy and direct WhatsApp share buttons (`wa.me/?text=...`).
4. **Marketing Assistant (`#marketing` or `?screen=marketing`)**:
   - Labelled as: **Template-Based Prototype (No live AI model connected)**.
   - 3 Tone selectors: Friendly, Professional, Energetic.
   - 5 Outreach channels with copy and WhatsApp buttons using dynamic public origin.
5. **Campaign Planner (`#planner` or `?screen=planner`)**:
   - Total budget: **₹2,000** (Ambassador Incentives: ₹1,000 | Promotional Experiments: ₹700 | Contingency: ₹300).
   - Total target: **500 students** (College Communities: 200 | Ambassadors: 200 | Technical Clubs: 100).
   - 7-Stage execution plan with distinct `ACTUAL` and `ESTIMATE` badges.
