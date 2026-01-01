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
Architecture : Microservices (Monorepo Managed)
Platform     : Web • Mobile (Planned)
Version      : v0.5.0-alpha

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
  - [2. Security Infrastructure (Zero Trust)](#2-security-infrastructure-zero-trust)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Create Network (if needed)](#4-create-network-if-needed)
  - [5. Start the Ecosystem](#5-start-the-ecosystem)
  - [6. Dashboard Access (Quick Links)](#6-dashboard-access-quick-links)
  - [7. Stop Services](#7-stop-services)
  - [Modular Management](#modular-management)
  - [QoL (npm) Scripts](#qol-npm-scripts)
- [Configuration](#configuration)
  - [Environment Templates](#environment-templates)
  - [Environment Modes](#environment-modes)
- [Progress](#progress)
  - [Roadmap Status](#roadmap-status)
  - [Active Stage Breakdown (Stage 3 \& 4)](#active-stage-breakdown-stage-3--4)
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
| **Core API** | Node.js v22 (Express) | Orchestrator, Auth & User Management |
| **Engine** | Go (Golang) | High-Performance Matchmaking Service |
| **Edge** | Kong + SafeLine + mTLS | API Gateway, WAF & Zero Trust Security |
| **Data (Active)**| Redis + Worker | Hot Data, Session & Write-Behind Sync |
| **Data (Store)** | PostgreSQL | Cold Data, Persistence & Archival |
| **Observability**| Prom / Grafana / Loki | System Metrics & Distributed Logging |
| **Ops** | Docker Compose | Multi-Environment Containerization |

### Backend API Endpoints

* **[API Endpoints](./docs/API_ENDPOINTS.md)**: Current list of active and planned REST endpoints.

## Installation & Setup

Riffle follows a **Tiered Enterprise Microservices Architecture**.
The system is split into **Edge**, **Data**, and **Service** layers, orchestrated via TurboRepo.

### Prerequisites
* **Docker Desktop** (running)
* **Node.js v22+** (Required for Vite/Client)
* **Git**

### 1. Setup & Installation

```bash
# Clone the repository
git clone [https://github.com/furkanalk/riffle.git](https://github.com/furkanalk/riffle.git)
cd riffle

# Install dependencies (Installs Turbo, Cross-Env, and Packages)
npm install
```

### 2. Security Infrastructure (Zero Trust)

Riffle uses mTLS (Mutual TLS) for service-to-service communication. You must generate the Root CA and Service Certificates before starting the system.

```bash
# Make the script executable (Linux/Mac/WSL)
chmod +x ops/scripts/generate-certs.sh

# Generate Certificates
./ops/scripts/generate-certs.sh
```
> **Note:** This will create a `ops/secrets/certs` directory containing keys for Postgres, Redis, and all microservices.

### 3. Environment Configuration

Copy the template to create your environment files. The system uses a 4-Environment Strategy.

```bash
# Create the Development environment file
cp ops/env/.env.example ops/env/.env.dev

# (Optional) Create others if needed
# cp ops/env/.env.example ops/env/.env.prod
```
> **Note:** Check `ops/env/.env.dev` and ensure **MTLS_ENABLED=false** for **Dev**, or **true** for **Prod**.

### 4. Create Network (if needed)

```bash
docker network create riffle_network
```

### 5. Start the Ecosystem

You can start the system in different modes depending on your goal.

- Option A: Development Mode (Recommended)
- Features: Hot-reload, HTTP (No mTLS), WAF Disabled, Debug Logs.

Best for: Coding, Testing features.

```bash
npm run start:dev # dev=test
```

- Option B: Production Simulation
- Features: Optimized Builds, mTLS Enabled, WAF Enabled (if configured), Secure Headers.

Best for: Final verification before deployment.

```bash
npm run start:prod # stage=prod
```

### 6. Dashboard Access (Quick Links)

Once the system is up, you can access the following services via localhost.

| Service | URL (Localhost) | Credentials (Default) |
| :--- | :--- | :--- |
| **Client App** | [http://localhost:5173](http://localhost:5173) | N/A |
| **Core API** | [http://localhost:1968](http://localhost:1968) | `RIFFLE_API_KEY` (Check .env) |
| **Kong Manager** | [http://localhost:8002](http://localhost:8002) | N/A |
| **WAF (Prod Only)**| [http://localhost:80](http://localhost:80) | N/A |

> **Note:** For a complete list of **Internal Docker DNS** names and Service-to-Service networking details, please refer to the **[Architecture Documentation](./docs/ARCHITECTURE.md#internal-service-discovery)**.

### 7. Stop Services

```bash
# Stops all containers and removes orphans
npm run stop:all

# Hard Reset (Stop + Clean Volumes + Restart)
npm run reset
```

### Modular Management

For the complete list of Modular Management, see  [`docs/COMMANDS.md`](docs/COMMANDS.md)

### QoL (npm) Scripts

For the complete list of Quality of Life (QoL) npm scripts, see  [`docs/COMMANDS.md`](docs/COMMANDS.md)

## Configuration

Riffle uses a centralized configuration strategy managed within the `ops/env/` directory.

### Environment Templates
Instead of guessing variables, use the master template:

1.  **Locate the Template:** [`ops/env/.env.example`](ops/env/.env.example)
2.  **Create your Environment:**
    ```bash
    cp ops/env/.env.example ops/env/.env.dev
    ```
3.  **Customize:** Edit `.env.dev` to match your local secrets.

### Environment Modes
The system behaves differently based on the `ENV` variable (handled automatically via `npm` scripts):

| Mode | File Used | Features |
|------|-----------|----------|
| **Dev** | `.env.dev` | No mTLS, WAF Disabled, Debug Logs |
| **Test** | `.env.test` | No mTLS, Mock Services |
| **Stage**| `.env.stage`| **mTLS Enabled**, SSL Required, Pre-Prod |
| **Prod** | `.env.prod` | **mTLS Enabled**, Tuned Performance, WAF Enabled |

**Generate secure API keys:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Or using OpenSSL (if installed)
openssl rand -hex 16
```

## Progress

- **Current Phase:** `Stage 3 & 4 (Hybrid)`
- **Focus:** Zero Trust Security, Kong Gateway Integration & Production Hardening

### Roadmap Status

```text
Stage 1: PoC Foundation        ██████████ 100% (Completed)
Stage 2: Identity & Data       ██████░░░░ 60%  (Auth Service segregated. User Profile pending.)
Stage 3: Modernization         ██████████ 100% (Monorepo, Node v22, Service Split DONE.)
Stage 4: Production Infra      ████████░░ 80%  (mTLS, Kong, Docker Network ready. WAF Tuning pending.)
Stage 5: Expansion             ░░░░░░░░░░ 0%   (Mobile & Anti-Cheat planned.)
```

### Active Stage Breakdown (Stage 3 & 4)
```text
- Infrastructure (S4)    ██████████ 100% (Docker, Redis, Postgres, Network isolation complete.)
- Security (S4)          ████████░░ 80%  (mTLS/Zero Trust active. WAF integration in progress.)
- Architecture (S3)      ██████████ 100% (TurboRepo, Centralized Config, Scripting complete.)
- Gameplay Logic (S1)    ▓▓▓▓▓░░░░░ 50%  (Marathon mode ready. Engine Service isolated.)
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