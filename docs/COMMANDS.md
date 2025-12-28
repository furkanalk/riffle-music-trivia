# Riffle – Management Commands

This document describes all available **modular Docker Compose commands** and **Quality of Life (QoL) npm scripts** used to manage the Riffle platform.

---

## Modular Docker Compose Commands

These commands allow you to manage each layer independently without using npm scripts.

---

### Security & Edge Layer (WAF + Kong)

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

---

### Data Layer (Postgres + Redis)

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

---

### Core Services (API + Worker)

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

---

### Game Engine (Matchmaker)

```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.matchmaker.yml \
  up -d

# Stop
docker-compose -f ops/compose/service.matchmaker.yml down
```

---

### Frontend (Client)

```bash
# Start
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/app.client.yml \
  up -d

# Stop
docker-compose -f ops/compose/app.client.yml down
```

---

## QoL (npm) Scripts

These npm scripts provide **high-level shortcuts** for common development workflows and are recommended for daily usage.

```bash
# =========================
# Global
# =========================
npm run start:dev        # Start everything
npm run stop:all         # Stop everything
npm run restart:all      # Stop + Start everything

# =========================
# ops – All
# =========================
npm run infra:all
npm run infra:down

# =========================
# ops – Security & Edge
# =========================
npm run infra:security   # WAF (SafeLine)
npm run infra:edge       # Kong (Gateway + Store + Service)
npm run infra:edge:down

# =========================
# ops – Data Layer
# =========================
npm run infra:data       # Postgres + Redis
npm run infra:data:down

# =========================
# Services – All
# =========================
npm run svc:all
npm run svc:down

# =========================
# Services – Core
# =========================
npm run svc:core         # Core API
npm run svc:worker       # Worker
npm run svc:core:down

# =========================
# Services – Game Engine
# =========================
npm run svc:engine       # Matchmaker
npm run svc:engine:down

# =========================
# Services – Others
# =========================
npm run svc:store
npm run svc:music
npm run svc:others
npm run svc:others:down

# =========================
# Frontend
# =========================
npm run app:client
npm run app:client:down

# =========================
# Utilities
# =========================
npm run logs             # Follow all container logs
npm run ps               # Docker compose status
npm run clean            # Remove volumes & orphans
npm run reset            # Clean + start:dev
```

---

### Notes
- Prefer **QoL npm scripts** for daily development.
- Use **modular Docker Compose commands** for debugging or partial environments.
- All commands assume `.env.dev` is present and correctly configured.

