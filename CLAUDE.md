# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 8100
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run test` - Run tests with Vitest
- `npm run test.lcov` - Run tests with coverage
- `npm run test.lcov.all` - Run tests with full coverage including all files
- `npm run test.debug` - Run tests in debug mode without watch
- `npm run test.once` - Run tests once without watch mode
- `npm run lint` - Run ESLint
- `npm start` - Alias for dev server on port 8100
- `npm run start.ios` - Start iOS development with live reload
- `npm run start.logserver` - Start development log server
- `npm run generate:vehicles` - Generate test vehicle data
- `npm run generate:sessions` - Generate test session data

## Development Guidelines

- Always run lint and build when confirming
- Comments should explain WHY, not WHAT - code should be self-documenting for what it does

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

**Logging**:

- Don't write `console.log/error/warn`, instead use `logToDevServer`

**Date Handling**:

- Use `formatDateForDisplay()` from `dateUtility.ts` for displaying date strings to avoid timezone issues
- Use `parseLocalDate()` when you need a Date object from a date string (YYYY-MM-DD format)
- Use `today()` from `dateUtility.ts` for getting current date in YYYY-MM-DD format
- Never parse date strings directly with `new Date(dateString)` as it treats them as UTC
- Never import date-fns directly - use centralized utilities in `dateUtility.ts` instead

**Custom Hooks**:

- If there is a custom hook already defined for a screen, use that instead of adding logic to the component directly
- Prefer adding business logic in helpers/utilities or custom hooks

## Code Organization Standards

### Component and Hook Structure

All React components and custom hooks should follow this consistent organization pattern:

#### 1. Variable and State Declarations (First)

```typescript
// Service and hook dependencies
const dispatch = useAppDispatch();
const vehicleService = useServices('vehicleService');
const vehicles = useAppSelector((s) => s.vehicles);

// Local state declarations
const [showModal, setShowModal] = useState(false);
const [isNew, setIsNew] = useState(true);
const [editingVehicle, setEditingVehicle] = useState<Vehicle>(null);
```

#### 2. Hook Usage (Second)

```typescript
// useEffect hooks
useEffect(() => {
  const loadData = async () => {
    // implementation
  };
  loadData();
}, [dependency]);

// Custom hooks and lifecycle hooks
useIonViewWillEnter(() => {
  refreshStats();
});

const { data, loading } = useCustomHook();
```

#### 3. Handler Functions (Third)

```typescript
// Event handlers and utility functions
const handleAddClick = () => {
  setShowModal(true);
  setIsNew(true);
};

const handleSaveClick = async (item: Item) => {
  // implementation
};

const refreshData = () => {
  setRefreshTrigger((prev) => prev + 1);
};
```

#### 4. Render/Return (Last)

```typescript
// Component render or hook return
return <IonPage>{/* JSX content */}</IonPage>;

// Or for hooks:
return {
  data,
  loading,
  handlers
};
```

### Benefits of This Structure:

- **Predictable**: Easy to find specific types of logic
- **Maintainable**: Clear separation of concerns
- **Readable**: Logical flow from setup → hooks → handlers → render
- **Consistent**: Same pattern across all components and hooks

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

**Nullable Types**: Use optional properties (`?`) instead of union types with null for nullable fields:

```typescript
// Preferred
type Vehicle = {
  year?: number;
  batterySize?: number;
};

// Not preferred
type Vehicle = {
  year: number | null;
  batterySize: number | null;
};
```

## Temporary Files

The following temporary files are generated during development:

- **Logs**: Stored in the `logs/` directory as `yyyy-mm-dd.log`
- **Database Copies**: Stored in the `temp_dbs/` directory as `yyyy-mm-dd-evstats.db`

## Development Guidelines

**API Documentation**: Always consult official documentation when uncertain about package APIs. Key resources:

- @capacitor-community/sqlite: https://github.com/capacitor-community/sqlite/blob/master/docs/API.md
- Ionic React: https://ionicframework.com/docs/react
- Redux Toolkit: https://redux-toolkit.js.org/
- Chart.js: https://www.chartjs.org/docs/

Use WebSearch or WebFetch tools to verify API usage before implementing features.

## Icon Resources

- Use https://ionic.io/ionicons as a reference for the available icons for the app

## Type Safety Guidelines

- Do not use `any` for types, always be explicit when typing
- No inline styles unless they are dynamic or absolutely required
- Always use the dateUtility for all date operations. Add to it if needed. It should always use date-fns before custom implementations

## Service Retrieval Pattern

Use the `getService` function from `ServiceContainer.ts` to retrieve services in components:

```typescript
import { getService } from '../services/ServiceContainer';

// In component
const vehicleService = getService('vehicleService');
```

Available services: `chargeStatsService`, `databaseBackupService`, `preferenceService`, `rateService`, `sessionService`, `vehicleService`, `vehicleStatsService`, `vehicleImportService`, `sessionImportService`, `fileExportService`, `exportService`, `purchaseService`

## Custom Hooks Pattern

The app uses custom hooks for screen-specific logic:

- `useVehicles` - Vehicle screen state management
- `useSessions` - Session screen state management  
- `useImmerState` - Immutable state updates with Immer

## Utility Functions

**Date Operations**: All date operations use `src/utilities/dateUtility.ts`:
- `today()` - Current date in YYYY-MM-DD format
- `parseLocalDate()` - Parse date string safely as local date
- `formatDateForDisplay()` - Format date string for display
- `getCurrentMonth()`, `getCurrentYear()` - Current period helpers
- Month/year navigation helpers

**File Operations**: Use `src/utilities/fileExport.ts` for file export functionality

**CSV Parsing**: Use `src/utilities/csvParser.ts` for CSV file processing

**Vehicle Validation**: Use `src/utilities/vehicleValidation.ts` for vehicle data validation

## Development Utilities

**Test Data Generation**: Use utility scripts to generate test data:
- `npm run generate:vehicles` - Creates test vehicle data
- `npm run generate:sessions` - Creates test session data

**Development Logging**: 
- Use `logToDevServer()` from `src/logger.ts` instead of console methods
- Start log server with `npm run start.logserver`
- Logs stored in `logs/` directory as daily files

**Database Backups**: 
- Temporary database copies stored in `temp_dbs/` directory
- Use `DatabaseBackupService` for programmatic backup operations

## Global Type Definitions

- `@evs-core` - Global type alias pointing to `evs-core.d.ts`
- `ExplicitAny` - Use instead of `any` type for better code documentation
- `PropsWithChildrenAndClass` - Common prop type for components with children and className

## Error Handling Patterns

- Custom error types in `src/errors/` (e.g., `NotFoundError`)
- Global `ErrorBoundary` with `AlertableError` component
- Service-level error handling with typed exceptions
