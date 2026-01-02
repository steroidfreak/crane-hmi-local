# Crane HMI Monorepo

Modernised operator console for crane lighting built as an npm workspace monorepo. The project now separates the UI and API while sharing common TypeScript types.

## Structure

- `apps/web`: React + TypeScript dashboard built with Vite and Material UI.
- `apps/api`: NestJS API providing REST endpoints, MQTT integration, authentication, and WebSocket updates.
- `libs/common`: Shared DTOs and type definitions consumed by both apps.
- `deploy`: Infrastructure configuration (nginx reverse proxy, Mosquitto defaults).

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose (for containerised runs)

## Setup

1. Install dependencies (workspaces):
   ```bash
   npm install
   ```
2. Copy environment samples and edit as needed:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
3. Start services during development:
   ```bash
   npm run dev:api      # NestJS API on http://localhost:3000
   npm run dev:web      # Vite dev server on http://localhost:5173
   ```

## API Overview

- REST endpoints (all prefixed with `/api` and JWT-protected):
  - `POST /api/boom/on|off`
  - `POST /api/trolley/on|off`
  - `POST /api/trolley/level` ({ level254: 0-254 })
  - `POST /api/light` ({ level254: 0-254 })
  - `GET /api/state` (digital twin snapshot)
  - `POST /api/auth/login` (returns JWT for subsequent calls)
- WebSocket namespace `/updates` broadcasts digital twin changes in real time (socket.io).
- Health endpoint `/api/health` is unauthenticated for probes.

MQTT topics default to `lights/cmd` (commands) and `lights/state` (status). Credentials and host are read from environment variables.

## Front-end Dashboard

- Industrial-themed UI with MUI AppBar, Cards, Buttons, and Sliders.
- Global state via Zustand to track authentication and the digital twin.
- REST calls drive boom/trolley toggles and level setpoints; real-time telemetry arrives through the WebSocket gateway.

## Docker Compose

Run the full stack (MQTT broker, API, web app, and nginx proxy) with:

```bash
docker-compose up --build
```

Services:
- `mqtt`: Eclipse Mosquitto (1883 exposed).
- `api`: NestJS service on port 3000 (inside the network).
- `web`: Vite preview server on 4173.
- `proxy`: nginx on port 8080, serving the web app and proxying `/api` + WebSockets to the API.

### DigitalOcean Deployment

1. Provision a Droplet with Docker and Docker Compose installed.
2. Copy repository contents to the Droplet and prepare environment files.
3. Run `docker-compose up --build -d` to start the stack.
4. Point your domain or load balancer at port 8080; TLS can be layered with a managed certificate or by extending the nginx configuration.

## Cleanup

Legacy Express/MQTT implementation (`server.js` and `public/`) was removed in favour of the workspace layout above.
