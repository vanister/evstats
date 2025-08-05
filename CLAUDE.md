# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 8100
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run test` - Run tests with Vitest
- `npm run test.lcov` - Run tests with coverage
- `npm run test.once` - Run tests once without watch mode
- `npm run lint` - Run ESLint
- `npm start` - Alias for dev server on port 8100
- `npm run start.logserver` - Start development log server

## Architecture Overview

This is an Ionic React mobile application for tracking electric vehicle charging statistics. The app uses a layered architecture with dependency injection and follows Redux Toolkit patterns for state management.

### Core Technologies
- **Frontend**: Ionic React with TypeScript
- **Database**: SQLite via @capacitor-community/sqlite
- **State Management**: Redux Toolkit
- **Charts**: Chart.js
- **Build Tool**: Vite
- **Testing**: Vitest with jsdom

### Application Structure

**Data Layer**:
- `DatabaseManager` (singleton) - SQLite connection management with migration support
- `DbContext` - Database abstraction layer
- Repository pattern with interfaces: `RateRepository`, `SessionRepository`, `VehicleRepository`, `ChargeStatsRepository`
- SQL query builders in `src/data/sql/`

**Business Logic**:
- Service layer with dependency injection via `ServiceContainer`
- Services: `RateService`, `SessionService`, `VehicleService`, `ChargeStatsService`, `DatabaseBackupService`, `PreferenceService`
- All services implement interfaces for testability

**Presentation**:
- Screen-based components in `src/screens/` (ChargeStatsScreen, SessionScreen, VehicleScreen, SettingsScreen)
- Reusable UI components in `src/components/`
- Redux slices for state management: `rateTypeSlice`, `vehicleSlice`, `lastUsedSlice`

### Key Patterns

**Dependency Injection**: The `ServiceContainer` initializes all services and repositories. Services are retrieved via `getService<ServiceName>()`.

**Database Management**: 
- Singleton `DatabaseManager` handles SQLite connections
- Migration scripts managed through `addUpgradeStatement`
- Connection consistency checks on startup

**State Management**:
- Redux Toolkit with typed hooks (`useAppDispatch`, `useAppSelector`)
- Async thunks for initialization and data updates
- Immutable state updates with Immer integration

**Error Handling**: 
- Global `ErrorBoundary` with `AlertableError` component
- Custom error types (e.g., `NotFoundError`)
- Development logging via `logToDevServer`

## Mobile Development

The app is configured for iOS deployment with Capacitor. Key mobile-specific features:
- SQLite database encryption support for iOS/Android
- Haptic feedback integration
- Status bar and splash screen configuration
- Biometric authentication setup (disabled by default)

## Testing

Tests use Vitest with jsdom environment. Mock implementations available in `src/__mocks__/` for repositories and test data.

## Type Safety

Custom type definitions in `.d.ts` files throughout the codebase. Global types available via `@evs-core` alias pointing to `evs-core.d.ts`.

## Development Guidelines

**API Documentation**: Always consult official documentation when uncertain about package APIs. Key resources:
- @capacitor-community/sqlite: https://github.com/capacitor-community/sqlite/blob/master/docs/API.md
- Ionic React: https://ionicframework.com/docs/react
- Redux Toolkit: https://redux-toolkit.js.org/
- Chart.js: https://www.chartjs.org/docs/

Use WebSearch or WebFetch tools to verify API usage before implementing features.