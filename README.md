# 🎸 Riffle
<img src="https://imgur.com/dkZQodk.png" width="200" height="200">
<p>A Rock & Metal music trivia game built with <strong>Node.js</strong>, <strong>Express</strong>, <strong>HTML</strong>, <strong>JavaScript</strong>, <strong>Tailwind CSS</strong> and the <strong>Deezer API</strong>.</p>

## 🚀 Features
<img src="https://i.imgur.com/BT6O05h.png" width="450" height="150">
<p> 🎶 Real-time trivia questions based on Deezer data </p>
<p>🧠 Multiple difficulty levels and game modes </p>

<img src="https://i.imgur.com/PDjGzKP.png" width="450" height="150">
<p> 🎨 Responsive design with Tailwind CSS </p>
<p> 📊 Score tracking and session-based history </p>

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, JavaScript (Vanilla), Tailwind CSS
- **API**: Deezer API, Custom REST API
- **Mobile**: Capacitor (iOS/Android)
- **Database**: PostgreSQL (planned)
- **Deployment**: Docker

## ⚙️ Installation

### Configurations and Frontend

```bash
git clone https://github.com/furkanalk/riffle.git

# Install dependencies
cd riffle/server && npm install && npm install pg
cd client && npm install && cd ..

# Create environment file
cp server/config/.env.example server/config/.env.dev
# Edit server/config/.env.dev with your configuration

# Password and sensitive keys can be generated with below commands:
openssl rand -hex 16
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Start development server (frontend)
npm run dev
```

### Docker Setup and Backend

```bash
# 1. Clone the repository
git clone https://github.com/furkanalk/riffle.git
cd riffle

# 2. Create and configure environment file
cp server/config/.env.example server/config/.env.dev
# Edit server/config/.env.dev with your configuration

# 3. Run with Docker Compose
# Development environment (Backend)
docker-compose --env-file ./server/config/.env.dev -f docker-compose-db.yaml -f docker-compose-app.yaml up --build

# Or for other environments
docker-compose --env-file ./server/config/.env.test -f docker-compose-db.yaml -f docker-compose-app.yaml up --build
docker-compose --env-file ./server/config/.env.stage -f docker-compose-db.yaml -f docker-compose-app.yaml up --build
docker-compose --env-file ./server/config/.env.prod -f docker-compose-db.yaml -f docker-compose-app.yaml up --build

# View logs
docker-compose -f docker-compose-db.yaml -f docker-compose-app.yaml logs -f

# Stop services
docker-compose -f docker-compose-db.yaml -f docker-compose-app.yaml down
```

### Environment Variables

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

## 🏗️ Architecture

### Backend API Endpoints
- `GET /api/tracks/playlist/:id/tracks` - Get tracks from playlist
- `GET /api/tracks/track/:id` - Get single track info
- `POST /api/auth/register` - User registration (planned)
- `POST /api/auth/login` - User login (planned)
- `POST /api/game/create` - Create game session (planned)
- `GET /api/game/:id` - Get game state (planned)


## 📁 Project Structure

```
.
├── .gitignore
├── LICENSE
├── README.md
├── docker-compose-db.yaml           # Database container setup
├── docker-compose-app.yaml          # Application container setup
│
├── client/                          # Frontend
│   ├── .env                         # Client environment variables
│   ├── .gitignore
│   ├── package.json                 # Node packages
│   ├── package-lock.json            # Package versions
│   ├── vite.config.js               # Vite configuration
│   ├── capacitor.config.js          # Mobile app configuration
│   ├── index.html                   # Main menu
│   ├── categories.html              # Category selection
│   ├── game.html                    # Game interface
│   │
│   └── src/
│       ├── main.js                  # Entry point
│       ├── categories/              # Category management
│       ├── core/                    # Core functionality
│       ├── game/                    # Game logic
│       ├── menu/                    # Menu components
│       ├── modes/                   # Game modes
│       ├── services/                # Service layer (Mock/Real)
│       ├── css/                     # Stylesheets
│       └── img/                     # Images & assets
│
└── server/                          # Backend
    ├── dockerfile                   # Server container image
    ├── package.json                 # Node packages
    ├── package-lock.json            # Package versions
    ├── server.js                    # Entry point
    │
    ├── config/                      # Environment configurations
    ├── controllers/                 # Route controllers
    ├── middleware/                  # Express middleware
    ├── models/                      # Data models
    ├── routes/                      # API routes
    └── utils/                       # Utility functions
```

## 📋 Project Status

> Temporary overview. Detailed progress will be tracked on a public board.

### 🏗 Architecture Refactoring (v2.0)
- [x] **Separation of Concerns:** Split Monolithic architecture into Client (Vite) and Server (Express).
- [x] **Client-Side:** Migrated to Vite for faster builds and better asset management.
- [x] **Multi-Environment Setup:** Configured distinct environments for Dev, Test, Stage, and Prod via Docker.
- [x] **Docker Integration:** Full containerization with dynamic configuration (no hardcoded env files in images).
- [x] **Proxy Configuration:** Setup Vite proxy to handle API requests seamlessly in dev mode.
- [x] **Database Isolation:** Postgres runs in a separate container with environment-specific data volumes.

### Completed Features
- [x] Add timer bar
- [x] Played songs won't play again
- [x] Improve answer quality
- [x] Improve score display
- [x] Add avatar selection to categories page
- [x] Make categories page scrollable
- [x] Add lives system to Marathon mode
- [x] Set Marathon mode to have "unlimited" questions by default
- [x] Add animations to category filtering
- [x] Show album cover of current track at end of round
- [x] Make music categories horizontally scrollable with navigation buttons
- [x] Add selection summary panel showing game mode and selected categories
- [x] Auto-add album covers
- [x] Remove music playing indicator text
- [x] Add audio visualizer in disk center that animates with music
- [x] Add music duration bar above album cover
- [x] Ensure music continues playing when answers are selected
- [x] Clean code and translate comments to English
- [x] Modular server architecture with environment configs
- [x] API key authentication system
- [x] Docker containerization setup
- [x] Capacitor mobile app configuration

### Pending
- [ ] **Service Factory Implementation:** Implement Mock/Real data switching for Client.
- [ ] Add endgame scoreboard etc.
- [ ] Change timeout answer color to yellow
- [ ] Add valid playlists
- [ ] Improve question variety
- [ ] Add guest mode
- [ ] Profile in top right
  - [ ] Recent match history
  - [ ] Score history
- [ ] Add language options
- [ ] Add images to categories
- [ ] Implement user authentication (Register/Login UI)
- [ ] Add multiplayer functionality
- [ ] Database integration (PostgreSQL) - *Infrastructure Ready, Logic Pending*
- [ ] Mobile app testing and deployment

## 📄 License

This project is **proprietary** and **not open source**.

Source code is available for **educational review only**.  
Any usage, modification, or distribution requires **explicit written permission** from the author.