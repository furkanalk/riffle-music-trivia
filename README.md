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

```bash
git clone https://github.com/furkanalk/riffle.git
cd riffle/server
npm install
cd ..client
npm install
```
## Environment Setup

Create the following files **manually** under `server/`:

- `.env.test`
- `.env.dev`
- `.env.stage`
- `.env.prod`

Fill their contents using the `.env.example` template below and replace the placeholders accordingly.

```
# --- APPLICATION ---
NODE_ENV=<env>
PORT=<port>

# --- DATABASE (<env> DB) ---
POSTGRES_USER=riffle_user
POSTGRES_PASSWORD=riffle_pass
POSTGRES_DB=riffle_<env>
POSTGRES_PORT=<postgres_port>

DATABASE_URL=postgresql://riffle_user:riffle_pass@db:<postgres_port>/riffle_<env>

# --- SECURITY ---
# Usage: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
RIFFLE_ENV_API_KEY=<YOUR_ENV_API_KEY_HERE>

# --- CORS ---
CORS_ORIGIN=<cors_origin>
```

## 🏗️ Architecture

### Backend API Endpoints
- `GET /api/tracks/playlist/:id/tracks` - Get tracks from playlist
- `GET /api/tracks/track/:id` - Get single track info
- `POST /api/auth/register` - User registration (planned)
- `POST /api/auth/login` - User login (planned)
- `POST /api/game/create` - Create game session (planned)
- `GET /api/game/:id` - Get game state (planned)


## Project Structure

```
.
├── LICENSE
├── README.md
├── client
│   ├── capacitor.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
├── docker-compose-app.yaml
├── docker-compose-db.yaml
└── server
    ├── config
    ├── controllers
    ├── dockerfile
    ├── middleware
    ├── models
    ├── package-lock.json
    ├── package.json
    ├── routes
    ├── server.js
    └── utils
```

## 📋 Project Status

> Temporary overview. Detailed progress will be tracked on a public board.

### Completed
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
- [ ] Add valid playlists
- [ ] Improve question variety
- [ ] Add guest mode
- [ ] Profile in top right
  - [ ] Recent match history
  - [ ] Score history
- [ ] Add language options
- [ ] Add images to categories
- [ ] Implement user authentication
- [ ] Add multiplayer functionality
- [ ] Database integration (PostgreSQL)
- [ ] Mobile app testing and deployment

## 📄 License

This project is **proprietary** and **not open source**.

Source code is available for **educational review only**.  
Any usage, modification, or distribution requires **explicit written permission** from the author.