# Riffle

<img src="https://imgur.com/dkZQodk.png" width="200" height="200" alt="Riffle Logo">

**A Rock & Metal music trivia game.**

---

## Table of Contents

- [Riffle](#riffle)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technical Architecture](#technical-architecture)
    - [Technologies Used](#technologies-used)
    - [Backend API Endpoints](#backend-api-endpoints)
  - [Project Structure](#project-structure)
  - [Installation \& Setup](#installation--setup)
    - [Frontend Local Development](#frontend-local-development)
  - [Configuration](#configuration)
  - [Project Roadmap \& Status](#project-roadmap--status)
    - [Phase 1: Architecture \& Infrastructure (The Foundation)](#phase-1-architecture--infrastructure-the-foundation)
    - [Phase 2: Core Gameplay \& UI (Completed Features)](#phase-2-core-gameplay--ui-completed-features)
    - [Phase 3: Identity \& Data Layer (Current Focus)](#phase-3-identity--data-layer-current-focus)
    - [Phase 4: Production Readiness \& Security (Enterprise Level)](#phase-4-production-readiness--security-enterprise-level)
    - [Phase 5: Expansion](#phase-5-expansion)
  - [License](#license)

---

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

* `GET /api/tracks/playlist/:id/tracks` - Retrieve tracks from a specific playlist
* `GET /api/tracks/track/:id` - Retrieve single track information
* `POST /api/auth/register` - User registration (Planned)
* `POST /api/auth/login` - User login (Planned)
* `POST /api/game/create` - Initialize game session (Planned)
* `GET /api/game/:id` - Retrieve current game state (Planned)

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

### Frontend Local Development

```bash
# Clone the repository
git clone [https://github.com/furkanalk/riffle.git](https://github.com/furkanalk/riffle.git)

# Install dependencies
cd riffle/server && npm install && npm install pg
cd ../client && npm install && cd ..

# Create environment file
cp server/config/.env.example server/config/.env.dev

# Start development server
cd client && npm run dev

### Docker Deployment (Backend & DB)

```bash
# Clone the repository
git clone [https://github.com/furkanalk/riffle.git](https://github.com/furkanalk/riffle.git)
cd riffle

# Configure environment
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
| `POSTGRES_DB` | PostgreSQL database name | `riffle_dev` |
| `POSTGRES_USER` | PostgreSQL username | `riffle_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `riffle_pass` |
| `POSTGRES_HOST` | PostgreSQL host | `db` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `DATABASE_URL` | Full database connection URL | `postgresql://...` |
| `RIFFLE_DEV_API_KEY` | API key for dev environment | Auto-generated |
| `RIFFLE_TEST_API_KEY` | API key for test environment | Auto-generated |
| `RIFFLE_STAGE_API_KEY` | API key for staging environment | Required |
| `RIFFLE_PROD_API_KEY` | API key for production environment | Required |
| `STAGE_ORIGIN` | Staging CORS origin | `https://stage.riffle.com` |
| `PROD_ORIGIN` | Production CORS origin | `https://riffle.com` |
| `DEEZER_API_KEY` | Deezer API key (if required) | - |

**Generate secure API keys:**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Project Roadmap & Status

**Current Phase:** Alpha (v2.1) - Implementing Authentication & Service Layer
**Architecture:** Modular Monolith (Client) + Microservices Ready (Server)

### Phase 1: Architecture & Infrastructure (The Foundation)
*Building a cloud-native, scalable foundation using Docker and Modern JS standards.*

- [x] **Separation of Concerns:** Split Monolithic architecture into Client (Vite) and Server (Express).
- [x] **Client-Side Migration:** Migrated to Vite for optimized builds and asset management.
- [x] **Modular Client Architecture:** Refactored JS into ES6 Modules (`state.js`, `module-import.js`) implementing **Single Source of Truth**.
- [x] **Multi-Environment Setup:** Configured distinct environments (Dev, Test, Stage, Prod) via Docker.
- [x] **Containerization:** Full Docker integration with dynamic configuration (Environment variables).
- [x] **Database Isolation:** PostgreSQL containerized with persistent volumes.
- [x] **Proxy Configuration:** Vite proxy setup for seamless API handling in Dev mode.
- [x] **State Management:** Implemented centralized state handling to prevent race conditions and circular dependencies.

### Phase 2: Core Gameplay & UI (Completed Features)
*Polishing the user experience and game mechanics.*

- [x] **Game Mechanics:**
  - [x] Timer bar & Visualizer integration.
  - [x] Logic implementation for unique song playback per session.
  - [x] Score & Streak display improvements.
  - [x] Marathon Mode (Unlimited rounds + Lives system).
  - [x] Continuous audio playback during answer selection.
- [x] **Category System:**
  - [x] Dynamic Filtering & Search logic.
  - [x] Horizontal scrolling categories with navigation controls.
  - [x] "Double Toggle" prevention logic.
  - [x] Live Selection Summary Panel.
  - [x] Avatar Selection UI.
- [x] **UI/UX Polish:**
  - [x] Animations for filtering and selection.
  - [x] Audio visualizer integration.
  - [x] Auto-fetching album covers & duration bars.
  - [x] Tabbed Interface (Settings vs Chat).
  - [x] Codebase refactoring and English localization.

### Phase 3: Identity & Data Layer (Current Focus)
*Connecting the Frontend Logic to Persistent Storage.*

- [ ] **User Authentication:**
  - [x] **UI:** Login/Register Modal & Button implementation.
  - [ ] **Logic:** Implement JWT (JSON Web Token) handling.
  - [ ] **Security:** BCrypt password hashing & Salt integration.
  - [ ] **Session:** Secure LocalStorage/Cookie management.
- [ ] **Service Layer Implementation:**
  - [ ] **Service Factory:** Architecture to switch between Mock vs Real Data providers.
  - [ ] **API Integration:** Connect `music.js` service to real PostgreSQL endpoints.
- [ ] **User Profile:**
  - [ ] Dashboard & Match History implementation.
  - [ ] Persistent Stats (Wins, High Scores).

### Phase 4: Production Readiness & Security (Enterprise Level)
*Preparing the infrastructure for public deployment.*

- [ ] **Advanced Security (DevSecOps):**
  - [ ] **API Gateway:** Implement **Kong OSS** for Rate Limiting & Auth Management.
  - [ ] **WAF:** Evaluate **Wallarm** or ModSecurity for L7 protection.
  - [ ] **Firewall Strategy:** Configure Cloud Firewall (L3/L4) to whitelist only Gateway ports.
- [ ] **Deployment Topology:**
  - [ ] **Zero-Downtime:** Implement **Rolling Update** strategy using Docker Swarm or Scripted Compose.
  - [ ] **Scalability:** Horizontal scaling of Node.js containers behind Kong Upstream.
  - [ ] **Maintenance Mode:** Implement graceful shutdown and "Under Maintenance" API responses.
- [ ] **Monitoring & Observability:**
  - [ ] Integration of Prometheus & Grafana for system health metrics.
- [ ] **CI/CD Pipeline:** Automated testing and deployment workflows.

### Phase 5: Expansion
*Platform growth and new features.*

- [ ] **Mobile App:** Finalize Capacitor builds for iOS & Android.
- [ ] **Multiplayer:** Real-time WebSocket integration for VS Mode.
- [ ] **Localization:** Multi-language support structure.

## License

This project is **proprietary** and **not open source**.

Source code is available for **educational review only**.
Any usage, modification, or distribution requires **explicit written permission** from the author.