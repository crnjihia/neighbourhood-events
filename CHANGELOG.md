# 📋 Changelog

All notable changes to the **Neighbourhood Events** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2026-10-14

### 🎉 Initial Production Release

**Neighbourhood Events** is a hyperlocal community events and volunteer-finder application tailored for Nairobi, Kenya. It empowers citizens to discover and participate in tree-planting drives, river cleanups, blood donation clinics, and neighbourhood meetups with offline-first persistence, GPS distance filtering, and real-time push notifications.

---

### ✨ Features & Architecture Highlights

#### 📱 Mobile & Web Client (Expo SDK 52 + React Native 0.76)
- **Offline-First Persistence**: Powered by [WatermelonDB](https://watermelondb.dev/) with native SQLite on Android/iOS and IndexedDB LokiJS adapter on Web. Users can browse events, view details, and RSVP without active internet connectivity.
- **Bi-Directional Sync Engine**: Implemented `synchronize()` with `/sync/pull` and `/sync/push` endpoints, automatically queueing offline mutations and resolving synchronization conflicts gracefully.
- **Adaptive Obsidian Dark Mode**: High-contrast, accessibility-tested theme engine (`ThemeContext`) featuring `#0B0F19` dark mode, clean light mode, and system preference auto-detection with persistent storage.
- **Hyperlocal Geolocation Discovery**: GPS-based distance calculations using the Haversine formula with dynamic radius filtering (`5 km`, `10 km`, `20 km`, `All`).
- **Interactive Map View**: Event pins and interactive cards with `react-native-maps` on mobile and zero-crash fallback on web.
- **Push Notification Integration**: Push token registration with geographic radius fan-out and interactive category actions via the Expo Push Gateway.
- **Seeded Nairobi Initiatives**: Pre-populated with 12 real-world initiatives across Karura Forest, Michuki Park, Sarit Centre, KNBTS, Nairobi Arboretum, KNH, and Kilimani.

#### 🖥️ Backend Cloud Services (Express + Prisma + PostgreSQL)
- **Sync Endpoints**: RESTful `/sync/pull` and `/sync/push` endpoints managing batch record retrieval and change ingestion with timestamps.
- **Push Fan-out Service**: Geographic and category-based push notification dispatcher querying nearby registered device tokens.
- **Database Schema**: Robust Prisma schema modeling `User`, `Event`, `RSVP`, and `DeviceToken` entities.
- **Dockerized Services**: Multi-service `docker-compose.yml` for PostgreSQL and backend development.

#### ⚙️ CI/CD & Build Infrastructure
- **EAS Build Automation**: Configured `.github/workflows/eas.yml` with `expo/expo-github-action@v8` to generate standalone preview APKs automatically using `EXPO_TOKEN`.
- **Continuous Integration**: Configured `.github/workflows/ci.yml` running linting, TypeScript strict typechecking, and Jest unit and component test suites.
- **Automated GitHub Releases**: Configured `.github/workflows/release.yml` with `softprops/action-gh-release@v2` triggered automatically on version tags.
- **Environment & Build Standards**: Standardized `.npmrc` with `legacy-peer-deps` and `.eslintignore` rules for clean, reproducible CI builds.
