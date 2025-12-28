<h1 align="center">🎸 Riffle: Music Trivia</h1>

<p align="center">
  <img src="https://imgur.com/dkZQodk.png" width="180" alt="Riffle Logo">
</p>

<p align="center">
  <strong>Real-time competitive music quiz engine powered by Modern Web Technologies.</strong><br>
  Designed for scalability, performance, heavy concurrency, and shred. Rock on!
</p>

<p align="center">
  <img src="https://img.shields.io/badge/architecture-Microservices-yellow">
  <img src="https://img.shields.io/badge/stack-Monorepo-black">
  <img src="https://img.shields.io/badge/backend-Node.js%20%7C%20Go-green">
  <img src="https://img.shields.io/badge/security-Rust%20(WASM)-orange">
  <img src="https://img.shields.io/badge/gateway-Kong%20%7C%20SafeLine-red">
  <img src="https://img.shields.io/badge/frontend-React%20%7C%20TypeScript-blue">
  <img src="https://img.shields.io/badge/infra-Docker%20%7C%20Terraform-purple">
  <img src="https://img.shields.io/badge/license-Proprietary-lightgrey">
</p>

```txt
RIFFLE — INFO

Genre        : Rock • Metal (more TBD)
Architecture : Modular Monolith > Microservices
Platform     : Web • Mobile
Version      : v0.4.5-alpha

“Test your music knowledge under pressure.”
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [Gameplay \& Competition](#gameplay--competition)
  - [Social, Progression \& Economy](#social-progression--economy)
- [Technical Architecture](#technical-architecture)
  - [Tech Stack Overview](#tech-stack-overview)
  - [Backend API Endpoints](#backend-api-endpoints)
- [Installation \& Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [1. Setup \& Installation](#1-setup--installation)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Create Network](#3-create-network)
  - [4. Start the Ecosystem](#4-start-the-ecosystem)
  - [5. Stop Services](#5-stop-services)
  - [Modular Management](#modular-management)
  - [QoL (npm) Scripts](#qol-npm-scripts)
- [Configuration  (to be updated)](#configuration--to-be-updated)
- [Progress](#progress)
  - [Roadmap Status](#roadmap-status)
  - [Active Stage Breakdown (Stage 1 \& 2)](#active-stage-breakdown-stage-1--2)
- [License](#license)

## Features

<img src="https://i.imgur.com/BT6O05h.png" width="450" height="150" alt="Feature Preview 1">

### Gameplay & Competition
1.  **Real-Time Versus Battles:** Challenge friends or match with random players globally in intense, synchronous music trivia duels.
2.  **Diverse Game Modes:** Test your endurance in **Marathon Mode**, survive the chaos in **Sudden Death**, or relax with **Classic Mode**.
3.  **Fair Play Guarantee:** Powered by a **Rust-based Anti-Cheat** engine that prevents bots and audio tampering, ensuring a purely skill-based environment.
4.  **Global Leaderboards:** Climb the ELO-based ranking system. Compete for daily, weekly, and all-time glory.
5.  **Community Driven:** Create your own custom quizzes, share them with the community, and play user-generated content.

<img src="https://i.imgur.com/PDjGzKP.png" width="450" height="150" alt="Feature Preview 2">

### Social, Progression & Economy
6.  **Deep Customization:** Unlock unique **Avatars**, profile frames, and audio visualizer themes in the Shop.
7.  **Social Hub:** Add friends, create private lobbies, and chat in real-time before matches.
8.  **Live Operations:** Participate in **Seasonal Events** (e.g., Halloween Rock Fest) and special tournaments with exclusive rewards.
9.  **Pro Membership (VIP):** Access exclusive game modes, ad-free experience, and premium cosmetic drops.
10. **Detailed Stats:** Track your progress with comprehensive match history, win rates, and create a "Favorites" list of songs you discovered while playing.

## Technical Architecture

Riffle utilizes a **Modular Monolith** architecture designed to evolve into Microservices. The project is managed as a **Monorepo** using TurboRepo to ensure type safety and atomic deployments.

**[Read the Full Architecture Documentation](./docs/ARCHITECTURE.md)** for a deep dive into our design decisions, security layers, and scaling strategy.

### Tech Stack Overview

| Component | Technology | Role |
|-----------|------------|------|
| **Frontend** | React 18 + Vite | User Interface & Global State (Zustand) |
| **Core API** | Node.js (Fastify) | Orchestrator, Auth & User Management |
| **Engine** | Go (Golang) | High-Performance Matchmaking Service |
| **Edge** | Kong + SafeLine WAF | API Gateway, Rate Limiting & Security |
| **Data (Active)**| Redis + Worker | Hot Data, Session & Write-Behind Sync |
| **Data (Store)** | PostgreSQL | Cold Data, Persistence & Archival |
| **Observability**| Prom / Grafana / Loki | System Metrics & Distributed Logging |
| **Ops** | Docker & Terraform | Multi-Environment Containerization |

### Backend API Endpoints

* **[API Endpoints](./docs/API_ENDPOINTS.md)**: Current list of active and planned REST endpoints.

## Installation & Setup

Riffle follows a **Tiered Enterprise Microservices Architecture**.
The system is split into **Edge**, **Data**, and **Service** layers, orchestrated via TurboRepo.

### Prerequisites

### 1. Setup & Installation

```bash
# Clone the repository
git clone https://github.com/furkanalk/riffle.git
cd riffle

# Install dependencies
npm install
```

### 2. Environment Configuration

The system uses a 4-Environment Strategy (Dev, Test, Stage, Prod).

```bash
# Generate environment configs for all stages
# This will create .env.dev, .env.test, .env.stage, .env.prod
# (Automatic if you used the migration script, otherwise copy manually)
cp infrastructure/env/.env.example infrastructure/env/.env.dev
```
### 3. Create Network

```bash
docker network create riffle_network
```

### 4. Start the Ecosystem

```bash
# Launches WAF -> Kong -> Redis/Postgres -> API Services
npm run start:dev

# Dashboard Access:
# ➜ Client:      http://localhost:5173
# ➜ Core API:    http://localhost:1968
# All dashboard urls will be provided in docs. (kong-waf-monitoring)
```

### 5. Stop Services

```bash
npm run stop:all
```

### Modular Management

For the complete list of Modular Management, see  [`docs/COMMANDS.md`](docs/COMMANDS.md)

### QoL (npm) Scripts

For the complete list of Quality of Life (QoL) npm scripts, see  [`docs/COMMANDS.md`](docs/COMMANDS.md)

## Configuration  (to be updated)

In the Monorepo structure, environment variables are managed centrally for infrastructure components.

Create environment files under `infrastructure/env/`:

- `.env.dev` - Development
- `.env.test` - Testing
- `.env.stage` - Staging
- `.env.prod` - Production

Use `ops/env/.env.example` as a template:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (dev/test/stage/prod) | `dev` |
| `PORT` | API Gateway port | `1968` |
| `POSTGRES_USER` | PostgreSQL username | `riffle_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `riffle_pass` |
| `POSTGRES_DB` | PostgreSQL database name | `riffle_dev` |
| `POSTGRES_HOST` | Database host (Docker service name) | `postgres` |
| `POSTGRES_PORT` | Database port | `5432` |
| `DATABASE_URL` | Full connection string (Prisma/Go) | `postgresql://...` |
| `REDIS_HOST` | Redis host | `redis` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_USER` | Redis username | `default` |
| `REDIS_PASSWORD` | Redis password | - |
| `JWT_SECRET` | Secret for signing JWTs | **Required** |
| `TOKEN_EXPIRES_IN` | Token expiration time | `1d` |
| `CORS_ORIGIN` | Allowed Frontend URL | `http://localhost:5173` |
| `RIFFLE_API_KEY` | Internal Service Key | **Required** |
| `DEEZER_API_KEY` | Deezer API key (if required) | - |

**Generate secure API keys:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Or using OpenSSL (if installed)
openssl rand -hex 16
```

## Progress

- **Current Phase:**  `Stage 1: Phase 1`
- **Focus:** Redis Setup & Service Layer Refactoring

### Roadmap Status

```text
Stage 1: PoC Foundation        ▓▓▓▓▓▓▓▓▓░ 90%  (Docker/DB ready. Base logic developed. Redis pending.)
Stage 2: Identity & Data       ▓▓▓▓░░░░░░ 40%  (Auth UI/JWT done. User Profile & Services pending.)
Stage 3: Modernization         ░░░░░░░░░░ 0%   (Monorepo, Go, & Fastify migration upcoming.)
Stage 4: Production Infra      ░░░░░░░░░░ 0%   (WAF, Kong, Terraform planned.)
Stage 5: Expansion             ░░░░░░░░░░ 0%   (Mobile & Anti-Cheat planned.)
```

### Active Stage Breakdown (Stage 1 & 2)
```text
- Infrastructure (S1)    ▓▓▓▓▓▓▓▓▓░ 90% (Postgres & Docker active. Redis integration next.)
- Gameplay Logic (S1)    ▓▓▓▓▓░░░░░ 50% (Marathon mode ready. Smart Algorithm pending.)
- Authentication (S2)    ▓▓▓▓▓▓▓░░░ 70% (Login/Register UI & JWT flow complete. Email Verify pending.)
- User Services (S2)     ░░░░░░░░░░ 0%  (Profile, History & Stats services not started.)
```

## License

Copyright (c) 2025 **Furkan Alkılıç**. All Rights Reserved.

This project is protected by a **Proprietary License**.
See the [LICENSE](./LICENSE) file for the full legal text.

```text
PERMISSIONS SUMMARY:
- Educational Use : You may view and study the source code for learning.
- Commercial Use  : Strictly prohibited.
- Distribution    : Strictly prohibited without explicit written permission.
- Modification    : You may not create derivative works for public release.
```