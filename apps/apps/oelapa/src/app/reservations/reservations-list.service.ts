import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  ReservationListItem, 
  ReservationFilters, 
  ReservationStatus,
  MOCK_RESERVATIONS 
} from './reservation.models';

export interface PaginatedReservations {
  items: ReservationListItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationsListService {
  // State management with signals
  private readonly _reservations = signal<ReservationListItem[]>(MOCK_RESERVATIONS);
  private readonly _loading = signal<boolean>(false);
  private readonly _filters = signal<ReservationFilters>({});
  private readonly _searchTerm = signal<string>('');
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  
  // Error handling and production readiness
  private readonly _error = signal<string | null>(null);
  private readonly _retryCount = signal<number>(0);
  private readonly _isOnline = signal<boolean>(navigator.onLine);
  private readonly _lastSuccessfulSync = signal<Date>(new Date());
  
  // Performance optimization signals
  private readonly _paginationLoading = signal<boolean>(false);
  private readonly _prefetchedPages = signal<Map<number, ReservationListItem[]>>(new Map());
  private readonly _totalServerCount = signal<number>(0); // For server-side pagination
  
  // Search and filtering optimization signals
  private readonly _searchCache = signal<Map<string, ReservationListItem[]>>(new Map());
  private readonly _filterCache = signal<Map<string, ReservationListItem[]>>(new Map());
  private readonly _lastSearchTerm = signal<string>('');
  private readonly _searchPerformanceMetrics = signal<{
    averageSearchTime: number;
    totalSearches: number;
    cacheHitRate: number;
  }>({
    averageSearchTime: 0,
    totalSearches: 0,
    cacheHitRate: 0
  });

  // Computed signals for filtered and paginated data
  public readonly reservations = this._reservations.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly isOnline = this._isOnline.asReadonly();
  public readonly lastSuccessfulSync = this._lastSuccessfulSync.asReadonly();
  public readonly filters = this._filters.asReadonly();
  public readonly searchTerm = this._searchTerm.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly pageSize = this._pageSize.asReadonly();
  
  // Performance optimization readonly signals
  public readonly paginationLoading = this._paginationLoading.asReadonly();
  public readonly totalServerCount = this._totalServerCount.asReadonly();
  
  // Search and filtering performance readonly signals
  public readonly searchPerformanceMetrics = this._searchPerformanceMetrics.asReadonly();

  // Filtered reservations based on current filters and search (pure computed, caching removed for signal compliance)
  public readonly filteredReservations = computed(() => {
    let filtered = this._reservations();
    const currentFilters = this._filters();
    const search = this._searchTerm().toLowerCase().trim();

    // Apply search filter
    if (search) {
      filtered = filtered.filter(reservation => 
        this.matchesSearchTerm(reservation, search)
      );
    }

    // Apply status filter
    if (currentFilters.statuses && currentFilters.statuses.length > 0) {
      filtered = filtered.filter(reservation =>
        currentFilters.statuses?.includes(reservation.status) ?? false
      );
    }

    // Apply date range filter
    if (currentFilters.checkInStart) {
      const startDate = new Date(currentFilters.checkInStart);
      filtered = filtered.filter(reservation => 
        new Date(reservation.checkInDate) >= startDate
      );
    }

    if (currentFilters.checkInEnd) {
      const endDate = new Date(currentFilters.checkInEnd);
      filtered = filtered.filter(reservation => 
        new Date(reservation.checkInDate) <= endDate
      );
    }

    // Apply guest count filter
    if (currentFilters.minGuests !== undefined) {
      filtered = filtered.filter(reservation => 
        reservation.guestCount >= (currentFilters.minGuests ?? 0)
      );
    }

    if (currentFilters.maxGuests !== undefined) {
      filtered = filtered.filter(reservation => 
        reservation.guestCount <= (currentFilters.maxGuests ?? Number.MAX_SAFE_INTEGER)
      );
    }

    // Apply total amount filter
    if (currentFilters.minAmount !== undefined) {
      filtered = filtered.filter(reservation =>
        (reservation.totalAmount ?? 0) >= (currentFilters.minAmount ?? 0)
      );
    }

    if (currentFilters.maxAmount !== undefined) {
      filtered = filtered.filter(reservation =>
        (reservation.totalAmount ?? 0) <= (currentFilters.maxAmount ?? Number.MAX_SAFE_INTEGER)
      );
    }

    return filtered;
  });

  // Total count of filtered reservations
  public readonly totalFilteredCount = computed(() => 
    this.filteredReservations().length
  );

  // Total pages based on filtered count
  public readonly totalPages = computed(() => 
    Math.ceil(this.totalFilteredCount() / this._pageSize())
  );

  // Paginated reservations for current page
  public readonly paginatedReservations = computed(() => {
    const filtered = this.filteredReservations();
    const startIndex = (this._currentPage() - 1) * this._pageSize();
    const endIndex = startIndex + this._pageSize();
    
    return {
      items: filtered.slice(startIndex, endIndex),
      totalCount: this.totalFilteredCount(),
      pageSize: this._pageSize(),
      currentPage: this._currentPage(),
      totalPages: this.totalPages()
    } as PaginatedReservations;
  });

  /**
   * Get all reservations with optional loading simulation
   */
  getReservations(simulateLoading = false): Observable<ReservationListItem[]> {
    this._loading.set(true);
    
    const response = of(this._reservations());
    
    if (simulateLoading) {
      return response.pipe(
        delay(800) // Simulate API call delay
      ).pipe(
        // Update loading state when done
        delay(0) // Ensure this runs after the delay
      );
    }
    
    // Update loading state immediately for sync operations
    setTimeout(() => this._loading.set(false), 0);
    return response;
  }

  /**
   * Search reservations by guest name or reservation ID with optimization
   */
  searchReservations(searchTerm: string): void {
    const startTime = performance.now();
    const trimmedSearch = searchTerm.trim();
    
    // Only update if search term actually changed
    if (this._searchTerm() !== trimmedSearch) {
      this._searchTerm.set(trimmedSearch);
      this._currentPage.set(1); // Reset to first page when searching
      this.clearPageCache(); // Clear pagination cache when search changes
      
      // Clear filter cache but keep search cache for performance
      const currentFilterCache = this._filterCache();
      currentFilterCache.clear();
      this._filterCache.set(new Map(currentFilterCache));
      
      // Track search performance
      this.updateSearchMetrics(startTime, false);
    }
  }

  /**
   * Apply filters to the reservation list with optimization
   */
  filterReservations(filters: ReservationFilters): void {
    const startTime = performance.now();
    // Only update if filters actually changed
    const currentFilters = this._filters();
    if (JSON.stringify(currentFilters) !== JSON.stringify(filters)) {
      this._filters.set(filters);
      this._currentPage.set(1); // Reset to first page when filtering
      this.clearPageCache(); // Clear pagination cache when filters change
      this.clearSearchAndFilterCache(); // Clear all caches when filters change
      
      // Track filtering performance
      this.updateSearchMetrics(startTime, false);
    }
  }

  /**
   * Clear all filters and search with cache optimization
   */
  clearFilters(): void {
    this._filters.set({});
    this._searchTerm.set('');
    this._currentPage.set(1);
    this.clearPageCache();
    this.clearSearchAndFilterCache();
  }

  /**
   * Clear prefetched page cache (call when data changes)
   */
  private clearPageCache(): void {
    this._prefetchedPages.set(new Map());
  }

  /**
   * Set page size for pagination
   */
  setPageSize(pageSize: number): void {
    this._pageSize.set(pageSize);
    this._currentPage.set(1); // Reset to first page when changing page size
    this.clearPageCache(); // Clear cache when page size changes
  }

  /**
   * Navigate to specific page with optimized loading
   */
  goToPage(page: number): void {
    const maxPage = this.totalPages();
    if (page >= 1 && page <= maxPage) {
      this.loadPage(page);
    }
  }

  /**
   * Load a specific page of data with optimized pagination
   */
  private loadPage(page: number): void {
    if (this._paginationLoading()) return; // Prevent duplicate requests
    
    this._paginationLoading.set(true);
    
    // Check if page is already prefetched
    const cachedPage = this._prefetchedPages().get(page);
    if (cachedPage) {
      this._currentPage.set(page);
      this._paginationLoading.set(false);
      return;
    }
    
    // Synchronous pagination for better testability
    const filteredData = this.filteredReservations();
    const startIndex = (page - 1) * this._pageSize();
    const endIndex = startIndex + this._pageSize();
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Cache the page data
    const updatedCache = new Map(this._prefetchedPages());
    updatedCache.set(page, pageData);
    this._prefetchedPages.set(updatedCache);
    
    // Update current page
    this._currentPage.set(page);
    this._paginationLoading.set(false);
    
    // Prefetch adjacent pages for better UX
    this.prefetchAdjacentPages(page);
  }

  /**
   * Prefetch adjacent pages for smoother navigation
   */
  private prefetchAdjacentPages(currentPage: number): void {
    const totalPages = this.totalPages();
    const pagesToPrefetch = [];
    
    // Add previous and next pages
    if (currentPage > 1) pagesToPrefetch.push(currentPage - 1);
    if (currentPage < totalPages) pagesToPrefetch.push(currentPage + 1);
    
    pagesToPrefetch.forEach(page => {
      if (!this._prefetchedPages().has(page)) {
        setTimeout(() => {
          const filteredData = this.filteredReservations();
          const startIndex = (page - 1) * this._pageSize();
          const endIndex = startIndex + this._pageSize();
          const pageData = filteredData.slice(startIndex, endIndex);
          
          const updatedCache = new Map(this._prefetchedPages());
          updatedCache.set(page, pageData);
          this._prefetchedPages.set(updatedCache);
        }, 50);
      }
    });
  }

  /**
   * Navigate to next page with optimized loading
   */
  nextPage(): void {
    const currentPage = this._currentPage();
    const maxPage = this.totalPages();
    if (currentPage < maxPage) {
      this.loadPage(currentPage + 1);
    }
  }

  /**
   * Navigate to previous page with optimized loading
   */
  previousPage(): void {
    const currentPage = this._currentPage();
    if (currentPage > 1) {
      this.loadPage(currentPage - 1);
    }
  }

  /**
   * Get reservation by ID
   */
  getReservationById(id: string): ReservationListItem | undefined {
    return this._reservations().find(reservation => reservation.id === id);
  }

  /**
   * Get count of reservations with warnings
   */
  getWarningCount(): number {
    return this.filteredReservations().filter(r => r.hasWarnings).length;
  }

  /**
   * Get all reservations with warnings
   */
  getReservationsWithWarnings(): ReservationListItem[] {
    return this.filteredReservations().filter(r => r.hasWarnings);
  }

  /**
   * Check if a reservation violates rate plan restrictions
   */
  checkRatePlanRestrictions(reservation: ReservationListItem): boolean {
    // Simulate rate plan validation logic
    // In production, this would check against actual rate plan rules
    return reservation.hasWarnings ?? false;
  }

  /**
   * Get warning severity level
   */
  getWarningSeverity(reservation: ReservationListItem): 'low' | 'medium' | 'high' {
    if (!reservation.hasWarnings) return 'low';
    
    // Determine severity based on warning type
    if (reservation.warningMessage?.includes('rate plan')) return 'high';
    if (reservation.warningMessage?.includes('restriction')) return 'medium';
    
    return 'low';
  }

  /**
   * Get available status options for filtering
   */
  getAvailableStatuses(): ReservationStatus[] {
    return Object.values(ReservationStatus);
  }

  /**
   * Get statistics about current reservations
   */
  getReservationStats() {
    const reservations = this.filteredReservations();
    const statusCounts = reservations.reduce((acc, reservation) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1;
      return acc;
    }, {} as Record<ReservationStatus, number>);

    const totalRevenue = reservations.reduce((sum, reservation) => 
      sum + (reservation.totalAmount ?? 0), 0
    );

    const averageStayLength = reservations.length > 0 
      ? reservations.reduce((sum, reservation) => {
          const checkIn = new Date(reservation.checkInDate);
          const checkOut = new Date(reservation.checkOutDate);
          const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / reservations.length
      : 0;

    return {
      totalReservations: reservations.length,
      statusCounts,
      totalRevenue,
      averageStayLength: Math.round(averageStayLength * 10) / 10 // Round to 1 decimal
    };
  }

  /**
   * Refresh reservations data (simulate API call)
   */
  refreshReservations(): Observable<ReservationListItem[]> {
    return this.getReservations(true);
  }

  /**
   * Load all filtered data for virtual scrolling (without pagination)
   */
  getAllFilteredReservations(): ReservationListItem[] {
    return this.filteredReservations();
  }

  /**
   * Enable/disable virtual scrolling mode
   */
  setVirtualScrollingMode(enabled: boolean): void {
    if (enabled) {
      // When virtual scrolling is enabled, load more data per "page"
      this._pageSize.set(100);
    } else {
      // Return to normal pagination
      this._pageSize.set(10);
    }
    this.clearPageCache();
  }

  /**
   * Enhanced search term matching with multiple criteria
   */
  private matchesSearchTerm(reservation: ReservationListItem, searchTerm: string): boolean {
    const lowerSearch = searchTerm.toLowerCase();
    
    return (
      reservation.guestName.toLowerCase().includes(lowerSearch) ||
      reservation.reservationId.toLowerCase().includes(lowerSearch) ||
      reservation.id.toLowerCase().includes(lowerSearch) ||
      reservation.status.toLowerCase().includes(lowerSearch) ||
      (reservation.guestEmail ? reservation.guestEmail.toLowerCase().includes(lowerSearch) : false) ||
      (reservation.phoneNumber ? reservation.phoneNumber.includes(searchTerm) : false) ||
      // Search by date strings
      reservation.checkInDate.includes(searchTerm) ||
      reservation.checkOutDate.includes(searchTerm) ||
      // Search by amount (if searching for numbers)
      (reservation.totalAmount ? reservation.totalAmount.toString().includes(searchTerm) : false)
    );
  }

  /**
   * Update search performance metrics
   */
  private updateSearchMetrics(startTime: number, cacheHit: boolean): void {
    const endTime = performance.now();
    const searchTime = endTime - startTime;
    
    const currentMetrics = this._searchPerformanceMetrics();
    const totalSearches = currentMetrics.totalSearches + 1;
    const averageSearchTime = (currentMetrics.averageSearchTime * currentMetrics.totalSearches + searchTime) / totalSearches;
    const cacheHits = cacheHit ? 1 : 0;
    const cacheHitRate = ((currentMetrics.cacheHitRate * currentMetrics.totalSearches) + cacheHits) / totalSearches;

    this._searchPerformanceMetrics.set({
      averageSearchTime,
      totalSearches,
      cacheHitRate
    });
  }

  /**
   * Clear search and filter caches (call when base data changes)
   */
  private clearSearchAndFilterCache(): void {
    this._searchCache.set(new Map());
    this._filterCache.set(new Map());
  }

  /**
   * Get search suggestions based on current data and past searches
   */
  getSearchSuggestions(currentInput: string): string[] {
    if (!currentInput || currentInput.length < 2) return [];

    const suggestions = new Set<string>();
    const lowerInput = currentInput.toLowerCase();
    const reservations = this._reservations();

    // Add guest name suggestions
    reservations.forEach(reservation => {
      if (reservation.guestName.toLowerCase().includes(lowerInput)) {
        suggestions.add(reservation.guestName);
      }
      
      // Add reservation ID suggestions
      if (reservation.reservationId.toLowerCase().includes(lowerInput)) {
        suggestions.add(reservation.reservationId);
      }

      // Add status suggestions
      if (reservation.status.toLowerCase().includes(lowerInput)) {
        suggestions.add(reservation.status);
      }
    });

    return Array.from(suggestions).slice(0, 8); // Return top 8 suggestions
  }

  /**
   * Optimize search by pre-indexing commonly searched fields
   */
  private createSearchIndex(): Map<string, Set<string>> {
    const index = new Map<string, Set<string>>();
    const reservations = this._reservations();

    reservations.forEach(reservation => {
      // Index guest names
      const guestWords = reservation.guestName.toLowerCase().split(' ');
      guestWords.forEach(word => {
        if (!index.has(word)) index.set(word, new Set());
        index.get(word)?.add(reservation.id);
      });

      // Index reservation IDs
      const reservationId = reservation.reservationId.toLowerCase();
      if (!index.has(reservationId)) index.set(reservationId, new Set());
      index.get(reservationId)?.add(reservation.id);

      // Index status
      const status = reservation.status.toLowerCase();
      if (!index.has(status)) index.set(status, new Set());
      index.get(status)?.add(reservation.id);
    });

    return index;
  }

  /**
   * Cleanup service resources and prevent memory leaks
   */
  cleanup(): void {
    // Clear all caches
    this.clearSearchAndFilterCache();
    this.clearPageCache();
    
    // Reset all signals to initial state
    this._reservations.set([]);
    this._filters.set({});
    this._searchTerm.set('');
    this._currentPage.set(1);
    this._pageSize.set(10);
    this._loading.set(false);
    this._paginationLoading.set(false);
    this._totalServerCount.set(0);
    
    // Reset performance metrics
    this._searchPerformanceMetrics.set({
      averageSearchTime: 0,
      totalSearches: 0,
      cacheHitRate: 0
    });
  }

  /**
   * Get service memory usage statistics
   */
  getServiceMemoryStats(): {
    reservationsCount: number;
    searchCacheSize: number;
    filterCacheSize: number;
    prefetchedPagesSize: number;
    totalEstimatedMemory: number;
  } {
    const reservationsCount = this._reservations().length;
    const searchCacheSize = this._searchCache().size;
    const filterCacheSize = this._filterCache().size;
    const prefetchedPagesSize = this._prefetchedPages().size;
    
    // Rough memory estimation in bytes
    const totalEstimatedMemory = 
      (reservationsCount * 1000) + // ~1KB per reservation
      (searchCacheSize * 500) +    // ~500B per search cache entry
      (filterCacheSize * 800) +    // ~800B per filter cache entry
      (prefetchedPagesSize * 2000); // ~2KB per prefetched page
    
    return {
      reservationsCount,
      searchCacheSize,
      filterCacheSize,
      prefetchedPagesSize,
      totalEstimatedMemory
    };
  }

  // ===============================================
  // PRODUCTION ERROR HANDLING & RECOVERY
  // ===============================================

  /**
   * Handle service errors with retry logic
   */
  private handleError(error: unknown, operation: string): void {
    console.error(`ReservationsListService ${operation}:`, error);
    
    const errorMessage = this.getErrorMessage(error, operation);
    this._error.set(errorMessage);
    
    // Increment retry count
    this._retryCount.update(count => count + 1);
    
    // Log error for monitoring
    this.logError(error, operation);
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: unknown, operation: string): string {
    if (!navigator.onLine) {
      return 'You appear to be offline. Please check your internet connection.';
    }
    
    const httpError = error as { status?: number; name?: string };
    
    if (httpError?.status === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    
    if (httpError?.status && httpError.status >= 500) {
      return 'Server error. Our team has been notified and is working on a fix.';
    }
    
    if (httpError?.status === 404) {
      return 'The requested data could not be found.';
    }
    
    if (httpError?.name === 'TimeoutError') {
      return 'Request timed out. Please try again.';
    }
    
    return `An unexpected error occurred while ${operation}. Please try again.`;
  }

  /**
   * Clear current error state
   */
  clearError(): void {
    this._error.set(null);
    this._retryCount.set(0);
  }

  /**
   * Retry failed operation with exponential backoff
   */
  retry(): void {
    const retryCount = this._retryCount();
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
    
    setTimeout(() => {
      this.clearError();
      // Trigger data refresh
      this.refreshData();
    }, delay);
  }

  /**
   * Refresh data with error handling
   */
  private refreshData(): void {
    try {
      this._loading.set(true);
      this._error.set(null);
      
      // In a real app, this would make an HTTP request
      // For now, we'll simulate potential errors
      const shouldSimulateError = Math.random() < 0.1; // 10% error rate for testing
      
      if (shouldSimulateError) {
        throw new Error('Simulated network error');
      }
      
      // Update last successful sync
      this._lastSuccessfulSync.set(new Date());
      
    } catch (error) {
      this.handleError(error, 'refreshing data');
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Monitor network connectivity
   */
  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this._isOnline.set(true);
      this.clearError();
    });
    
    window.addEventListener('offline', () => {
      this._isOnline.set(false);
      this._error.set('You are currently offline. Some features may not be available.');
    });
  }

  /**
   * Log errors for production monitoring
   */
  private logError(error: unknown, operation: string): void {
    // In production, this would send to a logging service
    const errorObj = error as { message?: string; stack?: string };
    const errorLog = {
      timestamp: new Date().toISOString(),
      operation,
      error: errorObj?.message || String(error),
      stack: errorObj?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      retryCount: this._retryCount()
    };
    
    // For now, just log to console in development
    if (typeof console !== 'undefined') {
      console.error('Production Error Log:', errorLog);
    }
    
    // In production, send to monitoring service:
    // this.monitoringService.logError(errorLog);
  }

  /**
   * Get current user ID for error tracking
   */
  private getCurrentUserId(): string | null {
    // In a real app, get from authentication service
    return 'anonymous';
  }

  /**
   * Validate data integrity
   */
  private validateData(data: ReservationListItem[]): boolean {
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: Expected array');
    }
    
    for (const item of data) {
      if (!item.id || !item.guestName || !item.status) {
        throw new Error('Invalid reservation data: Missing required fields');
      }
      
      if (typeof item.totalAmount !== 'number' || item.totalAmount < 0) {
        throw new Error('Invalid reservation data: Invalid total amount');
      }
    }
    
    return true;
  }

  /**
   * Sanitize search input to prevent XSS
   */
  private sanitizeSearchInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove any HTML tags and encode special characters
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>&"']/g, (match) => { // Encode special characters
        const entityMap: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return entityMap[match];
      })
      .trim()
      .substring(0, 100); // Limit length
  }

  /**
   * Initialize production features
   */
  init(): void {
    this.setupNetworkMonitoring();
    this._lastSuccessfulSync.set(new Date());
  }
}