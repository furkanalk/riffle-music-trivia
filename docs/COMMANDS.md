# Riffle Management Commands

A complete guide to all **modular Docker Compose commands** and **QoL (Quality of Life) npm scripts** for managing the Riffle platform.

---

## Modular Docker Compose Commands

Use these commands to manage each layer independently without npm shortcuts.

### 1. Security & Edge Layer (WAF + Kong)
```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/infra.security.yml \
  -f ops/compose/infra.edge.store.yml \
  -f ops/compose/infra.edge.service.yml \
  up -d

# Stop
docker-compose \
  -f ops/compose/infra.security.yml \
  -f ops/compose/infra.edge.store.yml \
  -f ops/compose/infra.edge.service.yml \
  down
```

### 2. Data Layer (Postgres + Redis)
```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/infra.data.store.yml \
  -f ops/compose/infra.data.active.yml \
  up -d

# Stop
docker-compose \
  -f ops/compose/infra.data.store.yml \
  -f ops/compose/infra.data.active.yml \
  down
```

### 3. Core Services (API + Worker)
```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.core.yml \
  -f ops/compose/service.worker.yml \
  up -d

# Stop
docker-compose \
  -f ops/compose/service.core.yml \
  -f ops/compose/service.worker.yml \
  down
```

### 4. Game Engine (Matchmaker)
```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.matchmaker.yml \
  up -d

# Stop
docker-compose \
  -f ops/compose/service.matchmaker.yml \
  down
```

### 5. Frontend (Client)
```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/app.client.yml \
  up -d

# Stop
docker-compose \
  -f ops/compose/app.client.yml \
  down
```

---

## QoL (npm) Scripts

High-level shortcuts for daily development. Recommended for most workflows.

### 1. Environment Switching (Dynamic Mode)

- Riffle scripts are environment-aware. By default, they run in development mode using .env.dev. You can target other environments (Test, Stage, Prod) by setting the ENV variable.
- Global commands can run with `:<env>`
- Others require `ENV=<env>`
  
```bash

# Default (runs with .env.dev)
npm run start

# Production (runs with .env.prod)
ENV=prod npm run start

# Staging (runs with .env.stage)
ENV=stage npm run start

# Example: Start only Infrastructure in Production mode
ENV=prod npm run infra:all
```

### 2. Global Commands
```bash
npm run start:dev        # Start everything (dev/test/stage/prod)
npm run stop:all         # Stop all containers
npm run restart:all      # Restart everything (Dev)
```

### 3. Infrastructure Commands

```bash
# All Layers
npm run infra:all        # Start all infra layers
npm run infra:down       # Stop all infra layers

# Security & Edge
npm run infra:security   # WAF (SafeLine)
npm run infra:edge       # Kong (Gateway + Store + Service)
npm run infra:edge:down  # Stop Edge layer

# 3. Data Layer
npm run infra:data       # Postgres + Redis
npm run infra:data:down  # Stop Data layer
```

### 4. Service Commands

```bash
# All Services
npm run svc:all          # Start all services
npm run svc:down         # Stop all services

# Core Services
npm run svc:core         # Core API
npm run svc:worker       # Worker
npm run svc:core:down    # Stop Core Services

# Game Engine
npm run svc:engine       # Matchmaker
npm run svc:engine:down  # Stop Game Engine

# Other Services
npm run svc:store
npm run svc:music
npm run svc:others
npm run svc:others:down

# Frontend Commands
npm run app:client
npm run app:client:down

# Utility Commands
npm run logs             # Follow all container logs
npm run ps               # Show Docker Compose status
npm run clean            # Remove volumes & orphan containers
npm run reset            # Clean + Start everything
```

---

### Notes
- Prefer **QoL npm scripts** for daily development.
- Use **modular Docker Compose commands** for debugging or partial environment setups.
- Prefer `ENV=prod npm run ...` over manually typing docker-compose commands for different environments.

