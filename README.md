# Mazingira App

A hyper‑local community events and volunteer‑finder for Nairobi.

## Overview
- **Offline‑first** mobile app built with **React Native** + **Expo**
- Local persistence with **WatermelonDB** (SQLite)
- Sync engine pulls/pushes changes to a **Node/Express** backend with **PostgreSQL** (via Prisma)
- Location‑based event discovery using **expo‑location**
- Push notifications via **expo‑notifications** (category opt‑in)
- Map view powered by **react‑native‑maps** with clustering
- Continuous Integration with **GitHub Actions**
- Automated builds for Android APK with **EAS Build**

## Architecture Diagram
```mermaid
flowchart TD
    App[Expo App] -->|SQLite| WatermelonDB
    WatermelonDB -->|Sync Pull/Push| Backend[Express + Prisma]
    Backend -->|PostgreSQL| DB[(PostgreSQL)]
    Backend -->|Expo Push API| ExpoPush[Expo Push Service]
    App -->|Expo Notifications| ExpoPush
    App -->|expo-location| UserLocation
    App -->|Map View| react-native-maps
```

## Getting Started

### Prerequisites
- Node.js ≥ 20
- npm (or Yarn) – we use npm here
- Expo CLI (`npm i -g expo-cli`)
- Docker (for the backend) – optional if you run Postgres locally

### Front‑end setup
```bash
cd Mazingira-App
npm install          # install JS dependencies (Expo SDK, WatermelonDB, etc.)
expo start          # runs the Metro bundler
# For native development run:
npx expo run:android   # or run:ios on macOS
```

### Backend setup
```bash
cd backend
npm install          # install server dependencies
# Set up a PostgreSQL database and define DATABASE_URL in a .env file
# Example .env (replace with your credentials)
# DATABASE_URL=postgresql://user:password@localhost:5432/mazingira
# JWT_SECRET=your-secret
npm run dev          # start the server (e.g. `node src/index.js`)
```

### Run tests
```bash
npm test            # runs Jest for both front‑end and back‑end
```

### CI & Build
- GitHub Actions automatically lint, type‑check and run tests on each push.
- EAS Build workflow creates an Android preview APK on pushes to `main`. Provide an `EXPO_TOKEN` secret in your repo settings.

## Development Workflow
1. **Feature** – create a new branch, implement UI or backend changes.
2. **Testing** – add or update Jest tests under `src/**/*.test.tsx` (frontend) and `backend/src/**/*.test.ts` (backend).
3. **Commit** – follow the conventional‑commit messages defined in the implementation plan.
4. **Push** – CI runs automatically; when ready, merge to `main` to trigger EAS builds.

## License
MIT © 2026 Mazingira App contributors
