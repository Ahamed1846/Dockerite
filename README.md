# Dockerite

![Node.js](https://img.shields.io/badge/Node.js-18+-lightgrey)
![React](https://img.shields.io/badge/React-18-blue)
![Dockerode](https://img.shields.io/badge/Dockerode-API-lightblue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

Dockerite is a modern, real-time Docker management dashboard built with Node.js, Express, Dockerode, Socket.IO, React, Vite, and Tailwind CSS.

It provides a full interface to inspect, manage, monitor, and control Docker containers, images, and system-level information with real-time updates and a clean developer-friendly UI.

## Features

* Real-time container management (start/stop/restart/remove)
* Live logs & stats streaming via WebSockets
* Container inspection & analytics
* Image, volume, and network management
* Advanced Create Container workflow
* Modern, responsive UI

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
* Chart.js
* Socket.IO Client

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
