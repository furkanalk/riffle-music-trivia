# Riffle Roadmap

- **Current Build:** `v0.5.0-alpha`
- **Current Phase:** `Stage 4: Production Readiness`

## Stage 1: PoC Fundementals
> *Setting up the baseline logic using standard technologies (Vanilla JS, Express).*

- [x] **Phase 1: Structural Overhaul**
  - [x] **Monorepo Init:** TurboRepo Setup complete (Apps/Ops split).
  - [x] **Service Split:** Core API, Worker, and Engine separated.
  - [x] **Environment Strategy:** 4-Env System (Dev/Test/Stage/Prod) implemented.
  - [x] **Cross-Platform:** Windows support added via `cross-env`.
  
- [ ] **Phase 2: Core Gameplay & Mechanics**
  - [ ] **Playlist Engine:** Unique song playback per session (No repeats).
  - [x] **Audio:** Continuous playback during answering.
  - [ ] **Visuals:** Timer bar & Audio Visualizer integration.
  - [ ] **Modes:** Marathon Mode logic (Lives system).
  - [x] **Feedback:** Score & streak display basics.

- [ ] **Phase 3: Smart Algorithms & Data Quality**
  - [ ] **Smart Options:** Context-aware wrong answer generation (Don't show Pop answers in Metal quiz).
  - [ ] **Sanitization:** Metadata validation (Filtering out "Remastered", "Live" tags).
  - [ ] **Content Curation:** Playlist integrity checks.

- [ ] **Phase 4: UI / UX Polish**
  - [x] Animations & Transitions (Tailwind).
  - [x] Category Filtering & Navigation.
  - [ ] **Endgame:** Session summary screen & "Play Again" loop.
  - [ ] **Landing:** Main menu polishing.

## Stage 2: Identity & Data Layer
> *Connecting the user to the data. Transitioning from "Guest" to "Player" on the current stack.*

- [ ] **Phase 1: Authentication Flow**
  - [ ] **Soft Verification Strategy:** Allow playing immediately, require email for rank/saving.
  - [ ] **Security:** BCrypt hashing & Salt.
  - [ ] **Token Management:** JWT issuance & **Redis-backed Session Storage** (Blacklisting/Refresh).
  - [ ] **UI:** Login / Register Modals.
  - [ ] **Verification:** Email confirmation flow (SMTP Mocking for Dev).
  - [ ] **Middleware (Legacy):** Basic Express middleware to validate JWTs and test Frontend error handling (401/403 flows).

- [ ] **Phase 2: Service Layer & Database**
  - [ ] **Migration Tool:** Implementation of a DB migration tool (e.g., node-pg-migrate or Prisma) to replace `init.db.js`.
  - [ ] **Service Pattern:** Abstracting logic (MockService vs RealService).
  - [ ] **Music Service:** Full PostgreSQL integration for track fetching.

- [ ] **Phase 3: User Profile & Meta**
  - [ ] **Stats:** Persistent Win/Loss & High Score tracking.
  - [ ] **History:** Match history logging.
  - [ ] **Cosmetics:** Basic Avatar management system.

## Stage 3: Architecture Modernization
> *Refactoring into a Scalable Enterprise Microservices Architecture.*

- [x] **Phase 1: Structural Overhaul**
  - [x] **Monorepo Init:** TurboRepo Setup complete (Apps/Ops split).
  - [x] **Service Split:** Core API, Worker, and Engine separated.
  - [x] **Environment Strategy:** 4-Env System (Dev/Test/Stage/Prod) implemented.

- [ ] **Phase 2: Game Engine Implementation**
  - [ ] **Matchmaker:** Go-based logic implementation (Container ready).
  - [ ] **Worker:** Implementing the Redis-to-Postgres sync logic.

- [ ] **Phase 3: Communication**
  - [ ] **Typed WebSocket:** Implementing Socket.io with Zod validation.
  - [ ] **Inter-service:** Basic HTTP/gRPC communication between Node.js and Go.

## Stage 4: Production Readiness & Security
> *Hardening the application for the public internet.*

- [ ] **Phase 1: Edge Security**
  - [ ] **WAF:** SafeLine container integration (Disabled in Dev).
  - [x] **Gateway:** Kong Gateway container & DB integration (Bootstrap implemented).
  - [x] **Zero Trust Prep:** mTLS Certificate volume mounting infrastructure ready.

- [ ] **Phase 2: DevOps & Infra**
  - [x] **Disaster Recovery:** Automated PostgreSQL Backup Sidecar integration.
  - [ ] **IaC:** Defining infrastructure with **Terraform**.
  - [ ] **Deployment:** Zero-downtime strategy (Rolling Updates).

- [ ] **Phase 3: Observability**
  - [ ] **Metrics:** Prometheus (Scraping) & Grafana (Dashboarding).
  - [ ] **Logs:** Loki (Log Aggregation) & Promtail.
  - [ ] **Health:** Distributed tracing & Uptime monitoring.

## Stage 5: Expansion & Competitive Integrity
> *Scaling to mobile and ensuring fair play.*

- [ ] **Phase 1: Platform Expansion**
  - [ ] **Mobile:** Capacitor builds for iOS & Android.
  - [ ] **Multiplayer:** Real-time VS Mode (WebSocket synchronization).
  - [ ] **Social:** Sharing & Friend system.
  - [ ] **Localization:** Multi-language support (i18n).

- [ ] **Phase 2: Competitive Integrity (Anti-Cheat)**
  - [ ] **Core:** Developing the **Rust** security module.
  - [ ] **Client:** Compiling Rust to **WebAssembly (WASM)**.
  - [ ] **Protection:** Audio Watermark verification & Bot detection heuristics.
  - [ ] **Events:** Tournament Mode infrastructure.