<h1 align="center">🎸 Quiz Game: Riffle</h1>

<p align="center">
  <img src="https://imgur.com/dkZQodk.png" width="180" alt="Riffle Logo">
</p>

<p align="center">
  <strong>Rock & Metal music trivia game</strong><br>
  Fast-paced quizzes powered by real music data.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active--development-purple">
  <img src="https://img.shields.io/badge/backend-Node.js-green">
  <img src="https://img.shields.io/badge/frontend-Vite%20%7C%20Tailwind-blue">
  <img src="https://img.shields.io/badge/mobile-Capacitor-lightgrey">
  <img src="https://img.shields.io/badge/license-Proprietary-red">
</p>

```txt
RIFFLE — MUSIC TRIVIA ENGINE

Genre        : Rock • Metal (more TBD)
Game Modes   : Classic • Marathon (more TBD)
Platform     : Web • Mobile
Version      : v0.4.0-alpha

“Test your music knowledge under pressure.”
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
  - [Technologies Used](#technologies-used)
  - [Backend API Endpoints](#backend-api-endpoints)
    - [1. Music Data (Active)](#1-music-data-active)
    - [2. Authentication (Implemented - Ready for Testing)](#2-authentication-implemented---ready-for-testing)
    - [3. Game Logic (Planned)](#3-game-logic-planned)
    - [4. System \& Infrastructure (Active)](#4-system--infrastructure-active)
- [Project Structure](#project-structure)
- [Installation \& Setup](#installation--setup)
  - [Local Development](#local-development)
  - [Docker Deployment (Backend \& DB)](#docker-deployment-backend--db)
- [Configuration](#configuration)
- [Project Roadmap \& Status](#project-roadmap--status)
  - [Phase 1: Architecture \& Infrastructure](#phase-1-architecture--infrastructure)
  - [Phase 2: Core Gameplay \& UI](#phase-2-core-gameplay--ui)
  - [Phase 3: Identity \& Data Layer](#phase-3-identity--data-layer)
  - [Phase 4: Production Readiness \& Security](#phase-4-production-readiness--security)
  - [Phase 5: Expansion](#phase-5-expansion)
- [Progress](#progress)
  - [Overall Progress (PoC)](#overall-progress-poc)
  - [Development Progress](#development-progress)
- [License](#license)

## Features

<img src="https://i.imgur.com/BT6O05h.png" width="450" height="150" alt="Feature Preview 1">

* **Real-time Trivia:** Dynamic questions generated based on Deezer music data.
* **Game Modes:** Multiple difficulty levels and specialized modes (Marathon, etc.).

<img src="https://i.imgur.com/PDjGzKP.png" width="450" height="150" alt="Feature Preview 2">

* **Modern UI:** Fully responsive design built with Tailwind CSS.
* **Analytics:** Score tracking and session-based history.

## Technical Architecture

### Technologies Used

* **Backend:** Node.js, Express.js
* **Frontend:** HTML5, JavaScript (ES6 Modules), Tailwind CSS, Vite
* **API:** Deezer API, Custom REST API
* **Mobile:** Capacitor (iOS/Android)
* **Database:** PostgreSQL (Containerized)
* **Infrastructure:** Docker, Docker Compose

### Backend API Endpoints

####  1. Music Data (Active)
* `GET /api/tracks/playlist/:id/tracks` - Retrieve tracks from a specific playlist.
* `GET /api/tracks/track/:id` - Retrieve single track information.

#### 2. Authentication (Implemented - Ready for Testing)
* `POST /api/auth/register` - Register a new user and return JWT.
* `POST /api/auth/login` - Authenticate user and return JWT.

#### 3. Game Logic (Planned)
* `POST /api/game/create` - Initialize a new game session.
* `GET /api/game/:id` - Retrieve current game state/score.
* `POST /api/game/:id/answer` - Submit an answer for server-side validation.

#### 4. System & Infrastructure (Active)
* `GET /health` - Health check for Docker/Uptime monitoring.
* `GET /secure-data` - API Key validation test endpoint.

## Project Structure

```text
.
├── .gitignore
├── LICENSE
├── README.md
├── docker-compose-db.yaml           # Database container orchestration
├── docker-compose-app.yaml          # Application container orchestration
│
├── client/                          # Frontend Application
│   ├── .env                         # Client environment variables
│   ├── vite.config.js               # Build configuration
│   ├── capacitor.config.js          # Mobile bridge configuration
│   ├── index.html                   # Entry HTML
│   └── src/
│       ├── main.js                  # Application entry point
│       ├── categories/              # Feature: Category Logic
│       ├── core/                    # Core Utilities & State
│       ├── game/                    # Feature: Game Loop Logic
│       ├── menu/                    # UI Components
│       └── services/                # Data Layer (Mock/Real Factory)
│
└── server/                          # Backend Application
    ├── dockerfile                   # Server image definition
    ├── server.js                    # Express entry point
    ├── config/                      # Environment configurations
    ├── controllers/                 # Request handlers
    ├── middleware/                  # Security & Logging middleware
    ├── models/                      # Database schemas
    └── routes/                      # API endpoint definitions
```

## Installation & Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/furkanalk/riffle.git
cd riffle

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Start frontend dev server
npm run dev
```

### Docker Deployment (Backend & DB)

```bash
# Open a new terminal, navigate to the riffle project
# Create an environment file from template
# Repeat for test / stage / prod if needed
cp server/config/.env.example server/config/.env.dev


# Run with Docker Compose
# Development environment
docker-compose --env-file ./server/config/.env.dev -f docker-compose-db.yaml -f docker-compose-app.yaml up --build

# Production environment
docker-compose --env-file ./server/config/.env.prod -f docker-compose-db.yaml -f docker-compose-app.yaml up --build

# View logs
docker-compose -f docker-compose-db.yaml -f docker-compose-app.yaml logs -f

# Stop services
docker-compose -f docker-compose-db.yaml -f docker-compose-app.yaml down
```

## Configuration

Create environment files under `server/config/`:

- `.env.dev` - Development
- `.env.test` - Testing
- `.env.stage` - Staging
- `.env.prod` - Production

Use `server/config/.env.example` as template:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (dev/test/stage/prod) | `dev` |
| `PORT` | Server port | `1968` |
| `POSTGRES_USER` | PostgreSQL username | `riffle_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `riffle_pass` |
| `POSTGRES_DB` | PostgreSQL database name | `riffle_dev` |
| `POSTGRES_HOST` | PostgreSQL host | `db` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `DATABASE_URL` | Full database connection URL | `postgresql://...` |
| `RIFFLE_DEV_API_KEY` | API key for dev environment | Auto-generated |
| `RIFFLE_TEST_API_KEY` | API key for test environment | Auto-generated |
| `RIFFLE_STAGE_API_KEY` | API key for staging environment | Required |
| `RIFFLE_PROD_API_KEY` | API key for production environment | Required |
| `RIFFLE_PROD_API_KEY` | API key for production environment | Required |
| `JWT_SECRET` | Secret for signing JWTs | Required |
| `TOKEN_EXPIRES_IN` | Token expiration time | `1d` |
| `PROD_ORIGIN` | Production CORS origin | `https://riffle.com` |
| `DEEZER_API_KEY` | Deezer API key (if required) | - |

**Generate secure API keys:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Or using OpenSSL (if installed)
openssl rand -hex 16
```

## Project Roadmap & Status

**Current Phase:** ```Alpha v0.4.0``` - Implementing Authentication & Service Layer
**Architecture:** Modular Monolith (Client) + Microservices Ready (Server)

### Phase 1: Architecture & Infrastructure
> *Building a cloud-native, scalable foundation using Docker and Modern JS standards.*

- [x] Separation of Concerns: Split Monolithic architecture into Client (Vite) and Server (Express).  
- [x] Client-Side Migration: Migrated to Vite for optimized builds and asset management.  
- [x] Modular Client Architecture: Refactored JS into ES6 Modules (state.js, module-import.js) implementing Single Source of Truth.  
- [x] Multi-Environment Setup: Configured distinct environments (Dev, Test, Stage, Prod) via Docker.  
- [x] Containerization: Full Docker integration with dynamic configuration (Environment variables).  
- [x] Database Isolation: PostgreSQL containerized with persistent volumes.  
- [x] Proxy Configuration: Vite proxy setup for seamless API handling in Dev mode.  
- [x] State Management: Implemented centralized state handling to prevent race conditions and circular dependencies.  

### Phase 2: Core Gameplay & UI
> *Polishing the user experience and game mechanics.*

- [ ] Game Mechanics:
  - [ ] Timer bar & Visualizer integration.  
  - [x] Logic implementation for unique song playback per session.  
  - [x] Score & Streak display improvements.  
  - [x] Marathon Mode (Unlimited rounds + Lives system).  
  - [x] Continuous audio playback during answer selection.  

- [ ] Smart Answer Algorithm:
  - [ ] Prevent obvious/easy wrong answers (e.g., Pop options in Metal category).  
  - [ ] Context-aware option generation.  

- [ ] Data Integrity:
  - [ ] Curate valid playlists (Filter out intros, covers, or wrong metadata).  
  - [ ] Fix "wrong song playing" issues.  

- [ ] Visual Progression:
  - [ ] Dynamic Progress Indicator (Bar or Steps) showing round progression.  
  - [ ] Enhanced Particle Effects for correct answers (More "juicy" visuals).  

- [ ] Scoreboard & Endgame:
  - [x] Show points and user names per round.  
  - [ ] Endgame Screen: Comprehensive summary, high score comparison, "Play Again" flow.  
  - [ ] Visual polish for the scoreboard.  

- [ ] Navigation & Landing:
  - [ ] Main Menu / Landing Page:  
    - [ ] Create a dedicated entry screen (Logo, Play Button, Video Background maybe).  
    - [ ] "About Us / Donate" section.  
    - [ ] Settings shortcut.  

- [ ] Category System:
  - [x] Dynamic filtering logic.  
  - [ ] Album covers hovering in the background (Replace placeholders).  
  - [x] Horizontal scrolling categories with navigation controls.  
  - [x] "Double Toggle" prevention logic.  
  - [ ] Live Selection Summary Panel (Mobile compatibility pending).  
  - [ ] Avatar Selection UI (Replace placeholders with real assets).  

- [ ] Chat System:
  - [ ] Chat Panel for users to chat with each other.  
  - [ ] Invite to lobby section (Link creation).  

- [ ] UI/UX Polish:
  - [x] Animations for filtering and selection.  
  - [x] Audio visualizer integration.  
  - [x] Auto-fetching album covers & duration bars.  
  - [x] Tabbed Interface (Settings vs Chat).  
  - [x] Codebase refactoring and English localization.  

### Phase 3: Identity & Data Layer
> *Connecting the Frontend Logic to Persistent Storage.*

- [ ] User Authentication:
  - [x] UI: Login/Register Modal & Button implementation.  
  - [x] Logic: Implement JWT (JSON Web Token) handling.  
  - [x] Security: BCrypt password hashing & Salt integration.  
  - [x] Session: Secure LocalStorage/Cookie management.  
  - [x] Database: Automated users table creation script (init.js).  
  - [x] API: Auth endpoints (/register, /login) configuration.  
  - [ ] Verification: End-to-end testing of Auth flow.  
  - [ ] Integration: Protect game routes (Guest vs User limitations).  

- [ ] Service Layer Implementation:
  - [ ] Service Factory: Architecture to switch between Mock vs Real Data providers.  
  - [ ] API Integration: Connect music.js service to real PostgreSQL endpoints.  

- [ ] User Profile:
  - [ ] Dashboard & Match History implementation.  
  - [ ] Persistent Stats (Wins, High Scores).  
  - [ ] Avatar management.  

### Phase 4: Production Readiness & Security
> *Preparing the infrastructure for public deployment.*

- [ ] Advanced Security (DevSecOps):
  - [ ] API Gateway: Implement Kong OSS for Rate Limiting & Auth Management.  
  - [ ] WAF: ModSecurity with OWASP Core Rule Set (L7 protection).  
  - [ ] Firewall Strategy: Configure Cloud Firewall (L3/L4) to whitelist only Gateway ports.  

- [ ] Deployment Topology:
  - [ ] Zero-Downtime: Implement Rolling Update strategy using Docker Swarm or Scripted Compose.  
  - [ ] Scalability: Horizontal scaling of Node.js containers behind Kong Upstream.  
  - [ ] Maintenance Mode: Implement graceful shutdown and "Under Maintenance" API responses.  

- [ ] Monitoring & Observability:
  - [ ] Integration of Prometheus & Grafana for system health metrics.  
  - [ ] Centralized Logging (ELK Stack or similar) for error tracking.  
  - [ ] CI/CD Pipeline: Automated testing and deployment workflows.  

### Phase 5: Expansion
> *Platform growth and new features.*

- [ ] Mobile App: Finalize Capacitor builds for iOS & Android.  
- [ ] Multiplayer: Real-time WebSocket integration for VS Mode.  
- [ ] Localization: Multi-language support structure.  
- [ ] Social Features: Share scores/results on social media.  

## Progress

> **Current Phase:** Building the Foundation & Architecture

### Overall Progress (PoC)

```
- Architecture & Infra     ▓▓▓▓▓▓▓░░░ 60%
- Core Gameplay            ▓▓▓▓▓░░░░░ 50%
- UI / UX                  ▓▓▓▓▓░░░░░ 50%
```

### Development Progress

_Not started. Will begin after PoC completion._

```
- Architecture & Infra     ░░░░░░░░░░ 0%
- Core Gameplay            ░░░░░░░░░░ 0%
- UI / UX                  ░░░░░░░░░░ 0%
- Auth & Persistence       ▓░░░░░░░░░ 40%
- Multiplayer              ░░░░░░░░░░ 0%
```

## License

This project is **proprietary** and **not open source**.

Source code is available for **educational review only**.
Any usage, modification, or distribution requires **explicit written permission** from the author.