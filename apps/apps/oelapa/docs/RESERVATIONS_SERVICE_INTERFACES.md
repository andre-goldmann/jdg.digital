# Reservations Service Interfaces Documentation

## Overview

The OELAPA reservations system is built on a comprehensive service architecture that separates concerns between reservation creation, list management, and data operations. This documentation covers all service interfaces, extension points, and integration patterns.

## Service Architecture

```
ReservationService (Creation & Management)
├── JWT Token Generation
├── API Communication
├── Error Handling
└── Validation

ReservationsListService (List Management & Filtering)
├── Data State Management
├── Search & Filtering
├── Pagination
├── Performance Optimization
└── Caching

AuthenticationService (Integration)
├── User Context
├── Token Management
└── Security
```

## ReservationService Interface

### Core Service Definition

```typescript
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthenticationService);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
}
```

### Public Methods

#### Modern Resource-Based API

```typescript
/**
 * Modern signal-based reservation creation using Angular's resource API
 * Provides reactive state management and automatic error handling
 */
public reservationResource = resource({
  params: () => this._currentReservationRequest(),
  loader: async ({ params: reservationData }): Promise<ReservationResponse | null> => {
    // Implementation details...
  }
});

/**
 * Trigger reservation creation with modern resource API
 * @param reservationData - The reservation details
 */
createReservationWithResource(reservationData: ReservationRequest): void

/**
 * Reset the reservation resource state
 */
resetReservationResource(): void
```

#### Traditional Observable API

```typescript
/**
 * Creates a new reservation through the API endpoint
 * @param reservationData - The reservation details
 * @returns Observable<ReservationResponse> - The reservation response
 * @throws ReservationError - When validation or API call fails
 */
createReservation(reservationData: ReservationRequest): Observable<ReservationResponse>
```

### Private Implementation Methods

#### Security & Authentication

```typescript
/**
 * Generates a JWT token for API authentication
 * @returns Promise<string> - The signed JWT token
 * @throws Error - When user is not authenticated or token generation fails
 * @private
 */
private async generateJwtToken(): Promise<string>
```

#### Data Validation

```typescript
/**
 * Validates reservation data before sending to API
 * @param data - The reservation data to validate
 * @throws Error - When validation fails with descriptive message
 * @private
 */
private validateReservationData(data: ReservationRequest): void
```

#### Error Handling & Retry Logic

```typescript
/**
 * Implements retry logic with exponential backoff
 * @param errors - The error stream
 * @returns Observable with retry logic
 * @private
 */
private retryLogic(errors: Observable<unknown>): Observable<unknown>

/**
 * Determines if an error is retriable (network/server errors)
 * @param error - The error to check
 * @returns boolean - True if error should be retried
 * @private
 */
private isRetriableError(error: unknown): boolean

/**
 * Handles errors from API calls with context-aware messaging
 * @param error - The error to handle
 * @returns Observable<never> - Error observable with user-friendly message
 * @private
 */
private handleError(error: unknown): Observable<never>
```

### Extension Points

#### Custom Validation

```typescript
interface ReservationValidator {
  validate(data: ReservationRequest): ValidationResult;
}

// Extension example
export class CustomReservationValidator implements ReservationValidator {
  validate(data: ReservationRequest): ValidationResult {
    // Custom validation logic
    return { isValid: true, errors: [] };
  }
}
```

#### Custom Error Handling

```typescript
interface ReservationErrorHandler {
  handleError(error: unknown, context: string): ReservationError;
}

// Extension example
export class CustomErrorHandler implements ReservationErrorHandler {
  handleError(error: unknown, context: string): ReservationError {
    // Custom error handling logic
    return { message: 'Custom error', code: '500', details: error };
  }
}
```

## ReservationsListService Interface

### Core Service Definition

```typescript
@Injectable({
  providedIn: 'root'
})
export class ReservationsListService {
  // State management with signals
  private readonly _reservations = signal<ReservationListItem[]>(MOCK_RESERVATIONS);
  private readonly _loading = signal<boolean>(false);
  private readonly _filters = signal<ReservationFilters>({});
  // ... other private signals
}
```

### Public Data Signals (Read-only)

```typescript
// Core data access
public readonly reservations: Signal<ReservationListItem[]>
public readonly loading: Signal<boolean>
public readonly filters: Signal<ReservationFilters>
public readonly searchTerm: Signal<string>
public readonly currentPage: Signal<number>
public readonly pageSize: Signal<number>

// Performance optimization signals
public readonly paginationLoading: Signal<boolean>
public readonly searchPerformanceMetrics: Signal<SearchPerformanceMetrics>

// Computed data signals
public readonly filteredReservations: Signal<ReservationListItem[]>
public readonly totalFilteredCount: Signal<number>
public readonly totalPages: Signal<number>
public readonly paginatedReservations: Signal<PaginatedReservations>
```

### Data Management Methods

```typescript
/**
 * Get all reservations with optional loading simulation
 * @param simulateLoading - Whether to simulate API delay
 * @returns Observable<ReservationListItem[]>
 */
getReservations(simulateLoading = false): Observable<ReservationListItem[]>

/**
 * Refresh reservations data (simulate API call)
 * @returns Observable<ReservationListItem[]>
 */
refreshReservations(): Observable<ReservationListItem[]>

/**
 * Get reservation by ID
 * @param id - The reservation ID
 * @returns ReservationListItem | undefined
 */
getReservationById(id: string): ReservationListItem | undefined
```

### Search & Filtering Methods

```typescript
/**
 * Search reservations by guest name or reservation ID with optimization
 * @param searchTerm - The search query
 */
searchReservations(searchTerm: string): void

/**
 * Apply filters to the reservation list with optimization
 * @param filters - The filter criteria
 */
filterReservations(filters: ReservationFilters): void

/**
 * Clear all filters and search with cache optimization
 */
clearFilters(): void

/**
 * Get search suggestions based on current data and past searches
 * @param currentInput - The current search input
 * @returns string[] - Array of search suggestions
 */
getSearchSuggestions(currentInput: string): string[]
```

### Pagination Methods

```typescript
/**
 * Set page size for pagination
 * @param pageSize - Number of items per page
 */
setPageSize(pageSize: number): void

/**
 * Navigate to specific page with optimized loading
 * @param page - Page number (1-based)
 */
goToPage(page: number): void

/**
 * Navigate to next page with optimized loading
 */
nextPage(): void

/**
 * Navigate to previous page with optimized loading
 */
previousPage(): void
```

### Performance & Optimization Methods

```typescript
/**
 * Load all filtered data for virtual scrolling (without pagination)
 * @returns ReservationListItem[] - All filtered reservations
 */
getAllFilteredReservations(): ReservationListItem[]

/**
 * Enable/disable virtual scrolling mode
 * @param enabled - Whether to enable virtual scrolling
 */
setVirtualScrollingMode(enabled: boolean): void

/**
 * Cleanup service resources and prevent memory leaks
 */
cleanup(): void

/**
 * Get service memory usage statistics
 * @returns ServiceMemoryStats - Memory usage information
 */
getServiceMemoryStats(): ServiceMemoryStats
```

### Statistics & Analytics Methods

```typescript
/**
 * Get available status options for filtering
 * @returns ReservationStatus[] - Array of available statuses
 */
getAvailableStatuses(): ReservationStatus[]

/**
 * Get statistics about current reservations
 * @returns ReservationStats - Aggregated statistics
 */
getReservationStats(): ReservationStats
```

## Data Models & Interfaces

### Core Data Models

```typescript
/**
 * Reservation request model for creating new reservations
 */
interface ReservationRequest {
  guestName: string;
  guestEmail?: string;
  phoneNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType?: string;
  specialRequests?: string;
  totalAmount?: number;
}

/**
 * Reservation response model from API
 */
interface ReservationResponse {
  success?: boolean;
  reservationId?: string;
  message?: string;
  error?: string;
  timestamp?: string;
}

/**
 * Reservation list item for display in tables/lists
 */
interface ReservationListItem {
  id: string;
  reservationId: string;
  guestName: string;
  guestEmail?: string;
  phoneNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType: string;
  status: ReservationStatus;
  totalAmount?: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Filter & Search Models

```typescript
/**
 * Comprehensive filtering options
 */
interface ReservationFilters {
  searchQuery?: string;
  statuses?: ReservationStatus[];
  checkInStart?: string;
  checkInEnd?: string;
  minGuests?: number;
  maxGuests?: number;
  minAmount?: number;
  maxAmount?: number;
  roomTypes?: string[];
}

/**
 * Pagination result model
 */
interface PaginatedReservations {
  items: ReservationListItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
```

### Performance & Analytics Models

```typescript
/**
 * Search performance metrics
 */
interface SearchPerformanceMetrics {
  averageSearchTime: number;
  totalSearches: number;
  cacheHitRate: number;
}

/**
 * Reservation statistics
 */
interface ReservationStats {
  totalReservations: number;
  statusCounts: Record<ReservationStatus, number>;
  totalRevenue: number;
  averageStayLength: number;
}

/**
 * Service memory usage statistics
 */
interface ServiceMemoryStats {
  reservationsCount: number;
  searchCacheSize: number;
  filterCacheSize: number;
  prefetchedPagesSize: number;
  totalEstimatedMemory: number;
}
```

### Error Handling Models

```typescript
/**
 * Standardized reservation error model
 */
interface ReservationError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Validation result model
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

## Extension Patterns

### Custom Data Sources

```typescript
/**
 * Abstract data source interface for custom implementations
 */
abstract class ReservationDataSource {
  abstract getReservations(filters?: ReservationFilters): Observable<ReservationListItem[]>;
  abstract createReservation(data: ReservationRequest): Observable<ReservationResponse>;
  abstract updateReservation(id: string, data: Partial<ReservationRequest>): Observable<ReservationResponse>;
  abstract deleteReservation(id: string): Observable<void>;
}

/**
 * Custom API data source implementation
 */
export class ApiReservationDataSource extends ReservationDataSource {
  constructor(private httpClient: HttpClient, private baseUrl: string) {
    super();
  }

  getReservations(filters?: ReservationFilters): Observable<ReservationListItem[]> {
    // Custom API implementation
    return this.httpClient.get<ReservationListItem[]>(`${this.baseUrl}/reservations`, {
      params: this.buildQueryParams(filters)
    });
  }

  // ... other method implementations
}
```

### Custom Search Strategies

```typescript
/**
 * Search strategy interface for custom search implementations
 */
interface SearchStrategy {
  search(data: ReservationListItem[], query: string): ReservationListItem[];
  getSuggestions(data: ReservationListItem[], input: string): string[];
}

/**
 * Fuzzy search strategy implementation
 */
export class FuzzySearchStrategy implements SearchStrategy {
  search(data: ReservationListItem[], query: string): ReservationListItem[] {
    // Fuzzy search implementation
    return data.filter(item => this.fuzzyMatch(item, query));
  }

  getSuggestions(data: ReservationListItem[], input: string): string[] {
    // Fuzzy suggestion implementation
    return this.generateFuzzySuggestions(data, input);
  }

  private fuzzyMatch(item: ReservationListItem, query: string): boolean {
    // Fuzzy matching logic
    return true; // Placeholder
  }

  private generateFuzzySuggestions(data: ReservationListItem[], input: string): string[] {
    // Fuzzy suggestion logic
    return []; // Placeholder
  }
}
```

### Custom Caching Strategies

```typescript
/**
 * Cache strategy interface for custom caching implementations
 */
interface CacheStrategy<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  clear(): void;
  size(): number;
}

/**
 * LRU cache strategy implementation
 */
export class LRUCacheStrategy<K, V> implements CacheStrategy<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  // ... other method implementations
}
```

## Service Integration Patterns

### Dependency Injection Setup

```typescript
/**
 * Service provider configuration
 */
export const RESERVATION_SERVICES = [
  ReservationService,
  ReservationsListService,
  {
    provide: ReservationDataSource,
    useClass: ApiReservationDataSource
  },
  {
    provide: SearchStrategy,
    useClass: FuzzySearchStrategy
  }
];

/**
 * Application module configuration
 */
@NgModule({
  providers: [
    ...RESERVATION_SERVICES,
    {
      provide: 'RESERVATION_CONFIG',
      useValue: {
        apiUrl: environment.reservationApiUrl,
        jwtSecret: environment.jwtSecret,
        cacheSize: 100,
        pageSize: 10
      }
    }
  ]
})
export class AppModule {}
```

### Service Communication Patterns

```typescript
/**
 * Inter-service communication using RxJS subjects
 */
@Injectable({
  providedIn: 'root'
})
export class ReservationEventService {
  private reservationCreatedSubject = new Subject<ReservationResponse>();
  private reservationUpdatedSubject = new Subject<ReservationListItem>();
  private reservationDeletedSubject = new Subject<string>();

  // Public observables
  readonly reservationCreated$ = this.reservationCreatedSubject.asObservable();
  readonly reservationUpdated$ = this.reservationUpdatedSubject.asObservable();
  readonly reservationDeleted$ = this.reservationDeletedSubject.asObservable();

  // Event emitters
  emitReservationCreated(reservation: ReservationResponse): void {
    this.reservationCreatedSubject.next(reservation);
  }

  emitReservationUpdated(reservation: ReservationListItem): void {
    this.reservationUpdatedSubject.next(reservation);
  }

  emitReservationDeleted(reservationId: string): void {
    this.reservationDeletedSubject.next(reservationId);
  }
}
```

## Testing Interfaces

### Service Testing Utilities

```typescript
/**
 * Mock reservation service for testing
 */
export class MockReservationService implements Partial<ReservationService> {
  createReservation = jasmine.createSpy('createReservation').and.returnValue(
    of({ success: true, reservationId: 'test-123' })
  );

  // ... other mock methods
}

/**
 * Test data factory for consistent test data
 */
export class ReservationTestDataFactory {
  static createReservationRequest(overrides: Partial<ReservationRequest> = {}): ReservationRequest {
    return {
      guestName: 'John Doe',
      checkInDate: '2024-03-01',
      checkOutDate: '2024-03-05',
      guestCount: 2,
      ...overrides
    };
  }

  static createReservationListItem(overrides: Partial<ReservationListItem> = {}): ReservationListItem {
    return {
      id: 'test-id',
      reservationId: 'RES-001',
      guestName: 'John Doe',
      checkInDate: '2024-03-01',
      checkOutDate: '2024-03-05',
      guestCount: 2,
      roomType: 'Standard',
      status: ReservationStatus.CONFIRMED,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      ...overrides
    };
  }
}
```

## Best Practices

### Service Design Principles

✅ **Single Responsibility**: Each service has a clear, focused purpose  
✅ **Signal-Based State**: Use Angular signals for reactive state management  
✅ **Immutable Data**: Never mutate state directly, always create new instances  
✅ **Error Handling**: Comprehensive error handling with user-friendly messages  
✅ **Performance**: Optimize for large datasets with caching and pagination  
✅ **Memory Management**: Proper cleanup to prevent memory leaks  
✅ **Testing**: Design services to be easily testable with clear interfaces  

### Extension Guidelines

✅ **Interface Segregation**: Use focused interfaces for specific functionality  
✅ **Dependency Injection**: Use Angular's DI system for loose coupling  
✅ **Configuration**: Make services configurable through injection tokens  
✅ **Event Communication**: Use reactive patterns for service communication  
✅ **Backward Compatibility**: Design extensions to not break existing functionality  

This comprehensive service interface documentation provides developers with all the information needed to understand, extend, and integrate the reservation services effectively.