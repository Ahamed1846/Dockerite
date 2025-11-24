# Dockerite

Dockerite is a modern, real-time Docker management dashboard built with Node.js, Express, Dockerode, Socket.IO, React, Vite, and Tailwind CSS.

It provides a full interface to inspect, manage, monitor, and control Docker containers, images, and system-level information with real-time updates and a clean developer-friendly UI.

## Features

### Containers

* List all containers with clean status indicators
* Start, stop, restart, and remove containers
* View container logs in real-time
* Detailed container inspection page
* Quick navigation to logs or details
* Create new containers through a fully interactive modal (name, image, ports, env)

### Images

* List Docker images
* Pull new images with real-time progress updates
* Remove images
* Clean, consistent UI

### Logs

* Real-time log streaming via WebSockets
* Color-coded log levels (info/warn/error)
* Auto-scroll toggle
* Clear log output
* Sticky header inside terminal

### Stats

* Live CPU and memory usage (WebSockets)
* Smooth line charts for usage over time
* Stats integrated directly into container detail page

### Dashboard

* System summary (running containers, stopped containers, total images, OS, kernel, architecture)
* Running vs stopped container chart
* Clean, functional overview layout

## Tech Stack

### Backend

* Node.js
* Express
* Dockerode
* Socket.IO
* CORS + Helmet
* Docker Engine API integration (stats, events, logs, container lifecycle)

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Lucide Icons
* Recharts
* Chart.js
* Socket.IO Client

## Architecture Diagram

```
[Frontend: React + Tailwind + Socket.IO]
            |
        (HTTP + WS)
            |
[Backend: Node.js + Express + Dockerode]
            |
       [Docker Engine API]
```

## Project Structure

```
dockerite/
 ├── backend/
 │    ├── src/
 │    │    ├── controllers/
 │    │    ├── services/
 │    │    ├── routes/
 │    │    ├── config/
 │    │    ├── utils/
 │    │    ├── app.js
 │    │    └── server.js
 │    └── package.json
 │
 └── frontend/
      ├── src/
      │    ├── components/
      │    ├── hooks/
      │    ├── layout/
      │    ├── pages/
      │    ├── lib/
      │    ├── index.css
      │    └── main.jsx
      ├── package.json
      └── vite.config.js
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs at:
`http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:
`http://localhost:5173`

## Requirements

* Docker Engine or Docker Desktop
* Node.js 18+
* Any modern OS (Linux/Mac/Windows)

## Why This Project Is Useful

Dockerite demonstrates practical knowledge in:

* Real-time systems
* Docker Engine APIs
* Streaming data
* Graphs and analytics
* WebSockets
* Full-stack architecture
* Production-level UI/UX patterns
* Docker lifecycle and containerization concepts

It's a strong project to display in a portfolio or resume for backend, frontend, or full-stack roles.