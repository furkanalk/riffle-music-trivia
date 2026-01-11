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

### 6. Observability & Monitoring (LGTM Stack)
* **Prometheus:** Metrics collection.
* **Thanos:** Long-term metric retention & global view (S3 Backend).
* **Grafana:** Visualization dashboard.
* **Loki:** Log aggregation (replacing traditional ELK stack).
* **Tempo:** Distributed Tracing (OpenTelemetry) to track requests across Microservices.

> **Hybrid Strategy:** Self-Hosted in Local Lab (Kind) vs. Grafana Cloud in AWS Production.

## Internal Service Discovery

Riffle uses a **Hybrid Infrastructure Strategy**:
- **Dev/Test:** Uses **Docker Bridge Network** (Container Names).
- **Stage/Prod:** Uses **Kubernetes CoreDNS** (Service DNS).

| Layer       | Service / Role            | 💻 Dev/Test Host (Docker) | ☁️ Stage/Prod DNS (K8s)                     | Port |
|:------------|:--------------------------|:--------------------------|:--------------------------------------------|:-----|
| **Ingress** | API Gateway (Public)      | `infra-kong`              | `kong-gateway-proxy.kong.svc...`            | 80/443|
| **Admin**   | Kong OSS GUI (Internal)   | `infra-kong:8002`         | `kong-gateway-manager.kong.svc...`          | 8002 |
| Security    | WAF (SafeLine)            | `infra-waf`               | `safeline-waf.security.svc...`              | 80   |
| Edge Store  | Kong DB (PG 14)           | `store-kong-pg`           | `store-kong-pg.riffle-dev.svc...`           | 5432 |
| Active      | Redis (Hot State)         | `active-game-redis`       | `active-game-redis.riffle-dev.svc...`       | 6379 |
| Store       | Game DB (PG 17)           | `store-game-pg`           | `store-game-pg.riffle-dev.svc...`           | 5432 |
| Service     | Core API (Node.js)        | `service-core-api`        | `core-api.riffle-dev.svc...`                | 3000 |
| Service     | Matchmaker (Go)           | `service-matchmaker`      | `matchmaker.riffle-dev.svc...`              | 50051|
| Service     | Store Service             | `service-store`           | `service-store.riffle-dev.svc...`           | 3002 |
| Service     | Music Service             | `service-music`           | `service-music.riffle-dev.svc...`           | 3003 |
| Monitor     | Prometheus                | `monitor-prometheus`      | `prometheus-server.monitoring.svc...`       | 9090 |
| Monitor     | Grafana                   | `monitor-grafana`         | `grafana.monitoring.svc...`                 | 3000 |
| **Worker**  | Async Worker              | `service-worker`          | *(No Service/DNS - Deployment Only)*        | N/A  |

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

1. **User:** Request enters via Internet.
2. **WAF:** SafeLine filters malicious traffic (SQLi, XSS).
3. **Ingress:** **Kong Ingress Controller** receives valid traffic.
   - Handles SSL Termination (mTLS).
   - Enforces Rate Limiting & Auth Plugins.
4. **Routing:** Kong routes request to Kubernetes Service (`core-api`).
5. **Logic:** Node.js/Go services process the request.
6. **Trace:** Tempo generates a trace ID to follow the request through Redis/Postgres.

> No direct client-to-engine communication exists.