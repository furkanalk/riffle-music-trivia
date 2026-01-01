# Riffle Technical Architecture

Riffle is designed as a modular, scalable system that prioritizes performance, security, and future service separation without premature complexity.

## Table of Contents

- [Riffle Technical Architecture](#riffle-technical-architecture)
  - [Table of Contents](#table-of-contents)
  - [Monorepo Structure](#monorepo-structure)
  - [Technology Stack](#technology-stack)
    - [1. Frontend (Client)](#1-frontend-client)
    - [2. Backend Gateway \& Authentication](#2-backend-gateway--authentication)
    - [3. Game Engine (Computation Core)](#3-game-engine-computation-core)
    - [4. Security Core (Planned)](#4-security-core-planned)
    - [5. Data \& State Management](#5-data--state-management)
    - [6. Observability \& Monitoring](#6-observability--monitoring)
  - [Internal Service Discovery](#internal-service-discovery)
  - [Security Architecture](#security-architecture)
    - [1. Edge Layer (Planned)](#1-edge-layer-planned)
    - [2. Gateway Layer](#2-gateway-layer)
    - [3. Application Layer](#3-application-layer)
    - [4. Client Integrity (Future)](#4-client-integrity-future)
  - [Runtime Containers](#runtime-containers)
  - [Scaling \& Failure Assumptions](#scaling--failure-assumptions)
    - [1. Scalability](#1-scalability)
    - [2. Data Consistency \& State](#2-data-consistency--state)
    - [3. Failure Scenarios](#3-failure-scenarios)
  - [Request Flow (High-Level)](#request-flow-high-level)

## Monorepo Structure

Riffle is designed as a **Fully Distributed System**. Code is organized by domain responsibilities.

```text
riffle/
├── apps/
│   ├── client/           # [React] Frontend application
│   ├── core-api/         # [Node.js] Main orchestrator (Auth/User)
│   ├── game-engine/      # [Go] Matchmaker & Scoring Logic
│   ├── worker/           # [Node.js] DB Sync (Write-Behind Pattern)
│   ├── store-service/    # [Node.js] Economy & Inventory
│   └── music-service/    # [Node.js] Deezer/Spotify Integration
│
├── ops/
│   ├── compose/          # Modular Docker Compose files (Granular Control)
│   ├── config/           # Dashboard & Tool configurations
│   ├── env/              # Per-environment configuration (.env.dev, .env.prod, etc.)
│   ├── scripts/          # Automation scripts (ctrl.js, dashboard.js)
│   └── secrets/          # mTLS Certs & Keys (GitIgnored)
│
└── packages/             # Shared logic (UI, DB Schema, Types)
```

## Technology Stack

### 1. Frontend (Client)
* **Framework:** React 18 + Vite
* **Language:** TypeScript
* **State Management:**
  * **Zustand:** Global client state
  * **React Query:** Server state & caching
* **Styling:** Tailwind CSS + Radix UI
* **Platform:** Web-first, Capacitor-compatible (iOS / Android)

> The client is responsible only for rendering, user input, and real-time communication. No authoritative game state or scoring logic exists on the client.

### 2. Backend Gateway & Authentication
* **Runtime:** Node.js
* **Framework:** Fastify
* **Language:** TypeScript
* **Protocols:** REST + WebSocket (Socket.io)

**Responsibilities:**
* API routing and request lifecycle
* Authentication & authorization
* Session handling
* Schema-based input validation
* WebSocket connection management

> Fastify is selected for its low overhead, predictable performance, and strict schema validation model.

### 3. Game Engine (Computation Core)
* **Language:** Go (Golang)
* **Communication:** Internal HTTP / gRPC (planned)
* **Execution Model:** Stateless

**Responsibilities:**
* Score calculation
* Matchmaking logic (ELO-based)
* Ranking computation
* High-concurrency, CPU-bound operations

> Go is used for workloads where Node.js may become a bottleneck due to its single-threaded execution model. Goroutines enable efficient parallel computation under heavy load.

### 4. Security Core (Planned)
* **Language:** Rust
* **Target:** WebAssembly (WASM)

**Responsibilities:**
* Client integrity verification
* Audio stream fingerprint validation
* Bot and automation detection
* Runtime tamper detection

> Rust is reserved for security-critical and real-time workloads due to its memory safety guarantees, zero garbage collection pauses, and resistance to reverse engineering when compiled to WASM.

### 5. Data & State Management
* **PostgreSQL**
  * Persistent data
  * Users, profiles, match history, metadata
* **Redis**
  * Live game rooms
  * Session tokens
  * Leaderboards
  * Pub/Sub for internal coordination

> All backend services are **stateless**. Any instance can be terminated or scaled without state loss.

### 6. Observability & Monitoring
* **Prometheus**
  * Pull-based metric collection from all containers.
* **Grafana**
  * Centralized dashboard for health, latency, and throughput visualization.
* **Loki**
  * Lightweight log aggregation optimized for Docker containers.

> Observability is decoupled from business logic. Monitoring agents run as sidecars or separate containers.

## Internal Service Discovery

Services communicate internally via the Docker Bridge Network using stable DNS names.
These URLs are managed in `.env` files.

| Service Key           | DNS Address                    | Port | Protocol      |
|-----------------------|--------------------------------|------|---------------|
| `WAF_HTTP_URL`        | `http://infra-waf`             | 80   | HTTP          |
| `WAF_HTTPS_URL`       | `https://infra-waf`            | 443  | HTTPS         |
| `KONG_PROXY_URL`      | `http://infra-kong`            | 8000 | HTTP          |
| `KONG_ADMIN_URL`      | `http://infra-kong`            | 8001 | HTTP          |
| `KONG_MANAGER_URL`    | `http://infra-kong`            | 8002 | HTTP          |
| `KONG_STATUS_URL`     | `http://infra-kong`            | 8100 | HTTP          |
| `CORE_API_URL`        | `http://service-core-api`      | 1968 | HTTP / mTLS   |
| `MATCHMAKER_URL`      | `http://service-matchmaker`    | 8080 | HTTP / mTLS   |
| `STORE_SERVICE_URL`   | `http://service-store`         | 3000 | HTTP / mTLS   |
| `MUSIC_SERVICE_URL`   | `http://service-music`         | 3000 | HTTP / mTLS   |
| `WORKER_URL`          | `http://service-worker`        | 3000 | HTTP / mTLS   |
| `GAME_REDIS_HOST`     | `active-game-redis`            | 6379 | TCP / TLS     |
| `POSTGRES_HOST`       | `store-game-pg`                | 5432 | TCP / SSL     |

## Security Architecture

Riffle follows a defense-in-depth security model.

### 1. Edge Layer (Planned)
* **WAF: SafeLine (Community Edition)**
  * Semantic traffic analysis
  * SQLi / XSS / Bot mitigation
  * Protects all external-facing traffic before it reaches the application layer

### 2. Gateway Layer
* **Kong API Gateway**
  * Rate limiting per IP / user
  * Auth verification
  * Request routing

### 3. Application Layer
* **Schema-based validation (Zod / Fastify)**
  * Strict input sanitization
  * Role-based access control

### 4. Client Integrity (Future)
* **Rust-based WASM module**
  * Runtime verification of critical assets

## Runtime Containers

| Layer      | Container Name       | Responsibility                     | Access              | Availability     |
|------------|----------------------|------------------------------------|---------------------|------------------|
| Security   | infra-waf            | L7 WAF (SafeLine)                  | Public Internet     | Stage / Prod     |
| Edge       | infra-kong           | API Gateway & Routing              | WAF Only            | All Envs         |
| Edge       | infra-kong-migrations| **Ephemeral** Kong DB Bootstrap    | Internal            | All Envs         |
| Edge Store | store-kong-pg        | Kong Configuration DB **(PG 14)**  | Kong Only           | All Envs         |
| Active     | active-game-redis    | Hot State (Sessions/Scores)        | Services            | All Envs         |
| Active     | service-worker       | Async DB Synchronization           | Internal            | All Envs         |
| Store      | store-game-pg        | Persistent Game Data **(PG 17)**   | Worker / Core API   | All Envs         |
| Store      | pg-backup            | Automated Daily SQL Backups        | None (Volume)       | All Envs         |
| Service    | service-core-api     | Auth & Orchestration               | Gateway             | All Envs         |
| Service    | service-matchmaker   | Calculation Engine (Go)            | **Internal (mTLS)** | All Envs         |
| Service    | service-store        | Economy & Inventory                | **Internal (mTLS)** | All Envs         |
| Service    | service-music        | Music Provider Proxy               | **Internal (mTLS)** | All Envs         |
| Monitor    | monitor-prometheus   | Metrics Collection (Scraping)      | Internal (Admin)    | Stage / Prod     |
| Monitor    | monitor-grafana      | Visualization Dashboard            | Internal (Admin)    | Stage / Prod     |
| Monitor    | monitor-loki         | Log Aggregation                    | Internal            | Stage / Prod     |
| DevTools   | dev-mailhog          | SMTP Mocking (Email Testing)       | Internal (Web)      | Dev / Test       |
| DevTools   | dev-httpbin          | HTTP Request Mocking               | Internal            | Dev / Test       |
| DevTools   | dev-redis-commander  | Redis GUI Management               | Internal (Web)      | Dev / Test       |

## Scaling & Failure Assumptions

### 1. Scalability
- **Horizontal Scaling:** All Service Layer containers (API, Engine, Store) are stateless and can scale horizontally behind the Gateway.
- **Database Scaling:** PostgreSQL is the single source of truth; read-replicas can be added for analytics. Redis handles high-throughput write operations.

### 2. Data Consistency & State
- **Eventual Consistency:** Due to the **Write-Behind** pattern, data in PostgreSQL (Store Layer) is eventually consistent. Real-time game state exists in the Active Layer (Redis) first.
- **Persistence & Backup:** - The `active-worker` service ensures data durability by moving completed match data from Redis to PostgreSQL asynchronously.
  - A dedicated `pg-backup` sidecar container performs automated daily backups of the PostgreSQL database to a secure volume, ensuring recovery point objectives (RPO) are met even in catastrophic failure scenarios.

### 3. Failure Scenarios
- **Service Failure:** If `core-api`, `matchmaker` or other services fail, they restart automatically. No state is lost as state lives in Redis.
- **Gateway Failure:** If Kong fails, the API becomes unreachable, but the underlying data remains intact.
- **Active Layer Failure:** If Redis fails critically without persistence, **live** match progress may be lost, but historical data (Postgres) remains secure.
- **Isolation:** A failure in the Public/Edge layer (WAF/Kong) does not compromise the Security of the Data Store layer.

## Request Flow (High-Level)

1. Edge: Request passes WAF -> Kong.
2. Routing: Kong routes to service-core-api.
3. Logic: Core API handles Auth and validates request.
4. Hot Path: Game events are written instantly to active-game-redis.
5. Async Sync: active-worker detects completed games in Redis.
6. Persistence: Worker moves data to store-game-pg (Postgres).

> No direct client-to-engine communication exists.