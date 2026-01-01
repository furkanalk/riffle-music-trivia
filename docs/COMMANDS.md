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

### 4. Domain Services (Store + Music)
```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.store.yml \
  -f ops/compose/service.music.yml \
  up -d

# Stop
docker-compose \
  -f ops/compose/service.store.yml \
  -f ops/compose/service.music.yml \
  down
```

### 5. Game Engine (Matchmaker)
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

### 6. Frontend (Client)
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
Riffle scripts use `cross-env` to ensure compatibility across Windows, Linux, and macOS.

### 1. Global Commands
```bash
npm run start          # Alias for start:dev
npm run start:dev      # Start everything (Dev Mode) - No mTLS
npm run start:test     # Start everything (Test Mode)
npm run start:stage    # Start everything (Stage Mode) - mTLS Enabled
npm run start:prod     # Start everything (Prod Mode) - mTLS + WAF
```

### 2. Global Stop & Reset
```bash
npm run stop:all       # Stop all running containers
npm run restart:all    # Stop all + Start Dev
npm run clean          # Remove docker volumes & orphan containers
npm run reset          # Full wipe (Stop + Clean + Start Dev)
```

### 3. Infrastructure Commands
```bash
# All Layers
npm run infra:up       # Start all infra layers (Security + Edge + Data)
npm run infra:down     # Stop all infra layers

# Granular
npm run infra:security # Start WAF
npm run infra:edge     # Start Kong Gateway + DB + Cache
npm run infra:data     # Start Postgres + Redis
```

### 4. Service Commands
```bash
# All Services
npm run svc:up         # Start all microservices
npm run svc:down       # Stop all microservices

# Individual Services
npm run svc:core       # Core API
npm run svc:worker     # Worker Service
npm run svc:engine     # Matchmaker (Game Engine)
npm run svc:store      # Store Service (Inventory/Economy)
npm run svc:music      # Music Service (Deezer Integration)
```

### 5. Frontend Commands
```bash
npm run app:up         # Start Client (Vite)
npm run app:down       # Stop Client
```

### 6. Utility & Monitoring
```bash
npm run logs             # Follow logs for Core API (Main entry point)
npm run ps               # Show formatted status of all containers
npm run infra:backup:now # Trigger immediate DB backup script
```
---

### Notes
- **Daily Workflow:** Prefer **QoL npm scripts** (`npm run ...`) over raw docker commands.
- **Windows Support:** Scripts use `cross-env`, making them compatible with PowerShell, CMD, and WSL.
- **Debugging:** Use modular `docker-compose` commands (above) for granular control.
- **Environments:** Use `npm run start:prod` or `npm run start:stage` instead of manually setting `ENV=`.

