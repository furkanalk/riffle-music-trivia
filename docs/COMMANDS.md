# Riffle Management Commands

Operational guide for managing the Riffle platform across:

- **Docker Compose** (Dev / Test)
- **Kubernetes** (Stage / Prod simulation)

This document covers:
- npm shortcuts (recommended)
- Modular Docker Compose commands (manual control)
- Kubernetes cluster operations
- Release & maintenance workflows

---

## 1. Quick Start (Recommended)

Use **npm scripts** for daily development and testing.  
These commands orchestrate Docker Compose internally and are the preferred workflow.

### 1.1 Environment Bootstrap
```bash
npm run start          # Alias for start:dev
npm run start:dev      # Start everything (Dev Mode, no mTLS)
npm run start:test     # Start everything (Test Mode)
npm run start:stage    # Stage Mode (mTLS enabled)
npm run start:prod     # Prod Mode (mTLS + WAF)
```

### 1.2 Stop, Restart & Reset
```bash
npm run stop:all       # Stop all running containers
npm run restart:all    # Stop all + start Dev
npm run clean          # Remove docker volumes & unused resources
npm run reset          # Full wipe (Stop + Clean + Start Dev)
```

### 1.3 Utilities & Monitoring
```bash
npm run logs             # Follow Core API logs
npm run ps               # Show formatted container status
npm run infra:backup:now # Trigger immediate DB backup
```

---

## 2. Infrastructure Control (npm)

Fine-grained control via npm wrappers around Docker Compose.

### 2.1 Infrastructure Layers
```bash
npm run infra:up       # Start all infra (Security + Edge + Data)
npm run infra:down     # Stop all infra
```

### 2.2 Granular Infrastructure
```bash
npm run infra:security # WAF
npm run infra:edge     # Kong Gateway + DB + Cache
npm run infra:data     # Postgres + Redis
```

---

## 3. Service Control (npm)

### 3.1 All Services
```bash
npm run svc:up         # Start all microservices
npm run svc:down       # Stop all microservices
```

### 3.2 Individual Services
```bash
npm run svc:core       # Core API
npm run svc:worker     # Worker service
npm run svc:engine     # Matchmaker (Game Engine)
npm run svc:store      # Store service
npm run svc:music      # Music service
```

---

## 4. Frontend Control (npm)

```bash
npm run app:up         # Start client (Vite)
npm run app:down       # Stop client
```

---

## 5. Modular Docker Compose (Manual)

Use these commands when you want explicit layer control without npm shortcuts.

### 5.1 Security & Edge Layer (WAF + Kong)
```bash
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/infra.security.yml \
  -f ops/compose/infra.edge.store.yml \
  -f ops/compose/infra.edge.service.yml \
  up -d

docker-compose \
  -f ops/compose/infra.security.yml \
  -f ops/compose/infra.edge.store.yml \
  -f ops/compose/infra.edge.service.yml \
  down
```

### 5.2 Data Layer (Postgres + Redis)
```bash
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/infra.data.store.yml \
  -f ops/compose/infra.data.active.yml \
  up -d

docker-compose \
  -f ops/compose/infra.data.store.yml \
  -f ops/compose/infra.data.active.yml \
  down
```

### 5.3 Core Services
```bash
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.core.yml \
  -f ops/compose/service.worker.yml \
  up -d

docker-compose \
  -f ops/compose/service.core.yml \
  -f ops/compose/service.worker.yml \
  down
```

### 5.4 Domain Services
```bash
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.store.yml \
  -f ops/compose/service.music.yml \
  up -d

docker-compose \
  -f ops/compose/service.store.yml \
  -f ops/compose/service.music.yml \
  down
```

### 5.5 Game Engine
```bash
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/service.matchmaker.yml \
  up -d

docker-compose \
  -f ops/compose/service.matchmaker.yml \
  down
```

### 5.6 Frontend
```bash
docker-compose --env-file ops/env/.env.dev \
  -f ops/compose/app.client.yml \
  up -d

docker-compose \
  -f ops/compose/app.client.yml \
  down
```

---

## 6. Kubernetes Operations (Stage / Prod Simulation)

### 6.1 Cluster Management
```bash
kind create cluster --config ops/k8s/kind/riffle-cluster.yaml
kind delete cluster --name riffle-cluster
```

### 6.2 Workload Management
```bash
helm install riffle-infra ./ops/k8s/charts/infra
kubectl apply -f ops/k8s/manifests/
kubectl rollout restart deployment/core-api -n riffle-dev
```

### 6.3 Debugging & Access
```bash
kubectl port-forward svc/kong-gateway-manager -n kong 8002:8002
kubectl port-forward svc/grafana -n monitoring 3000:3000
kubectl exec -it deployment/core-api -n riffle-dev -- /bin/sh
```

---

## 7. Release & Maintenance

### 7.1 Code Quality (Biome)
```bash
npm run check
npm run format
npm run lint
```

### 7.2 Release Management (release-it)
```bash
npm run release
npm run release -- --dry-run
```

### 7.3 Mobile Configuration (Trapeze)
```bash
npm run mobile:sync
```

---

## Notes

- **Recommended workflow:** npm scripts for daily work, Kubernetes for infra testing.
- **Windows support:** Docker scripts use cross-env; Kubernetes works via PowerShell or WSL2.
- **Debugging:**
  - Docker: docker logs -f <container>
  - K8s: kubectl logs -f -l app=core-api -n riffle-dev or k9s
- **Environment handling:** Do not manually set ENV; use npm scripts or Kubernetes ConfigMaps.
