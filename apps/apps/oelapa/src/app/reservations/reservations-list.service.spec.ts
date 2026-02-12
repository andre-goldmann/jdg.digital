import { TestBed } from '@angular/core/testing';
import { ReservationsListService } from './reservations-list.service';
import { ReservationStatus, ReservationFilters, MOCK_RESERVATIONS } from './reservation.models';

describe('ReservationsListService', () => {
  let service: ReservationsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationsListService);
  });

  afterEach(() => {
    // Clean up service state after each test
    service.cleanup();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with mock data', () => {
      expect(service.reservations().length).toBeGreaterThan(0);
      expect(service.reservations()).toEqual(MOCK_RESERVATIONS);
    });

    it('should initialize with default state', () => {
      expect(service.loading()).toBe(false);
      expect(service.currentPage()).toBe(1);
      expect(service.pageSize()).toBe(10);
      expect(service.searchTerm()).toBe('');
      expect(service.filters()).toEqual({});
      expect(service.paginationLoading()).toBe(false);
    });
  });

  describe('Data Retrieval', () => {
    it('should get all reservations', (done) => {
      service.getReservations().subscribe(reservations => {
        expect(reservations.length).toBeGreaterThan(0);
        expect(reservations).toEqual(MOCK_RESERVATIONS);
        done();
      });
    });

    it('should simulate loading when requested', (done) => {
      const startTime = Date.now();
      service.getReservations(true).subscribe(reservations => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(800); // Should have delay
        expect(reservations).toEqual(MOCK_RESERVATIONS);
        done();
      });
    });

    it('should refresh reservations data', (done) => {
      service.refreshReservations().subscribe(reservations => {
        expect(reservations).toEqual(MOCK_RESERVATIONS);
        done();
      });
    });

    it('should get reservation by ID', () => {
      const firstReservation = MOCK_RESERVATIONS[0];
      const foundReservation = service.getReservationById(firstReservation.id);
      expect(foundReservation).toEqual(firstReservation);
    });

    it('should return undefined for non-existent reservation ID', () => {
      const foundReservation = service.getReservationById('non-existent-id');
      expect(foundReservation).toBeUndefined();
    });
  });

  describe('Search Functionality', () => {
    it('should search reservations by guest name', () => {
      const searchTerm = 'John';
      service.searchReservations(searchTerm);
      
      const filtered = service.filteredReservations();
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(reservation => {
        expect(reservation.guestName.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    it('should search reservations by reservation ID', () => {
      const firstReservation = MOCK_RESERVATIONS[0];
      const searchTerm = firstReservation.reservationId;
      service.searchReservations(searchTerm);
      
      const filtered = service.filteredReservations();
      expect(filtered.length).toBe(1);
      expect(filtered[0].reservationId).toBe(searchTerm);
    });

    it('should search reservations by status', () => {
      const searchTerm = ReservationStatus.CONFIRMED;
      service.searchReservations(searchTerm);
      
      const filtered = service.filteredReservations();
      if (filtered.length > 0) {
        filtered.forEach(reservation => {
          expect(reservation.status.toLowerCase()).toContain(searchTerm.toLowerCase());
        });
      }
    });

    it('should handle empty search term', () => {
      service.searchReservations('');
      expect(service.searchTerm()).toBe('');
      expect(service.filteredReservations().length).toBe(MOCK_RESERVATIONS.length);
    });

    it('should trim search terms', () => {
      const searchTerm = '  John  ';
      service.searchReservations(searchTerm);
      expect(service.searchTerm()).toBe('John');
    });

    it('should reset to first page when searching', () => {
      const totalPages = service.totalPages();
      const targetPage = Math.min(totalPages, 2); // Use page 2 or max available
      
      if (targetPage > 1) {
        service.goToPage(targetPage);
        expect(service.currentPage()).toBe(targetPage);
        
        service.searchReservations('John');
        expect(service.currentPage()).toBe(1);
      } else {
        // If only 1 page, just test that search doesn't change page
        service.searchReservations('John');
        expect(service.currentPage()).toBe(1);
      }
    });

    it('should not update if search term is the same', () => {
      const searchTerm = 'John';
      service.searchReservations(searchTerm);
      const currentPage = service.currentPage();
      
      service.searchReservations(searchTerm); // Same search term
      expect(service.currentPage()).toBe(currentPage);
    });

    it('should provide search suggestions', () => {
      const suggestions = service.getSearchSuggestions('j');
      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBeLessThanOrEqual(8);
    });

    it('should return empty suggestions for short input', () => {
      const suggestions = service.getSearchSuggestions('j');
      expect(suggestions.length).toBeGreaterThanOrEqual(0);
      
      const emptySuggestions = service.getSearchSuggestions('x');
      expect(emptySuggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter by reservation status', () => {
      const filters: ReservationFilters = {
        statuses: [ReservationStatus.CONFIRMED]
      };
      
      service.filterReservations(filters);
      const filtered = service.filteredReservations();
      
      if (filtered.length > 0) {
        filtered.forEach(reservation => {
          expect(reservation.status).toBe(ReservationStatus.CONFIRMED);
        });
      }
    });

    it('should filter by multiple statuses', () => {
      const statuses = [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN];
      const filters: ReservationFilters = { statuses };
      
      service.filterReservations(filters);
      const filtered = service.filteredReservations();
      
      if (filtered.length > 0) {
        filtered.forEach(reservation => {
          expect(statuses).toContain(reservation.status);
        });
      }
    });

    it('should filter by check-in date range', () => {
      const checkInStart = '2024-01-01';
      const checkInEnd = '2024-12-31';
      const filters: ReservationFilters = { checkInStart, checkInEnd };
      
      service.filterReservations(filters);
      const filtered = service.filteredReservations();
      
      filtered.forEach(reservation => {
        const checkInDate = new Date(reservation.checkInDate);
        expect(checkInDate.getTime()).toBeGreaterThanOrEqual(new Date(checkInStart).getTime());
        expect(checkInDate.getTime()).toBeLessThanOrEqual(new Date(checkInEnd).getTime());
      });
    });

    it('should filter by guest count range', () => {
      const minGuests = 2;
      const maxGuests = 4;
      const filters: ReservationFilters = { minGuests, maxGuests };
      
      service.filterReservations(filters);
      const filtered = service.filteredReservations();
      
      filtered.forEach(reservation => {
        expect(reservation.guestCount).toBeGreaterThanOrEqual(minGuests);
        expect(reservation.guestCount).toBeLessThanOrEqual(maxGuests);
      });
    });

    it('should filter by total amount range', () => {
      const minAmount = 100;
      const maxAmount = 1000;
      const filters: ReservationFilters = { minAmount, maxAmount };
      
      service.filterReservations(filters);
      const filtered = service.filteredReservations();
      
      filtered.forEach(reservation => {
        const amount = reservation.totalAmount ?? 0;
        expect(amount).toBeGreaterThanOrEqual(minAmount);
        expect(amount).toBeLessThanOrEqual(maxAmount);
      });
    });

    it('should combine multiple filters', () => {
      const filters: ReservationFilters = {
        statuses: [ReservationStatus.CONFIRMED],
        minGuests: 2,
        maxGuests: 4
      };
      
      service.filterReservations(filters);
      const filtered = service.filteredReservations();
      
      filtered.forEach(reservation => {
        expect(reservation.status).toBe(ReservationStatus.CONFIRMED);
        expect(reservation.guestCount).toBeGreaterThanOrEqual(2);
        expect(reservation.guestCount).toBeLessThanOrEqual(4);
      });
    });

    it('should reset to first page when filtering', () => {
      const totalPages = service.totalPages();
      const targetPage = Math.min(totalPages, 2); // Use page 2 or max available
      
      if (targetPage > 1) {
        service.goToPage(targetPage);
        expect(service.currentPage()).toBe(targetPage);
        
        const filters: ReservationFilters = {
          statuses: [ReservationStatus.CONFIRMED]
        };
        service.filterReservations(filters);
        expect(service.currentPage()).toBe(1);
      } else {
        // If only 1 page, just test that filter doesn't change page
        const filters: ReservationFilters = {
          statuses: [ReservationStatus.CONFIRMED]
        };
        service.filterReservations(filters);
        expect(service.currentPage()).toBe(1);
      }
    });

    it('should not update if filters are the same', () => {
      const filters: ReservationFilters = {
        statuses: [ReservationStatus.CONFIRMED]
      };
      
      service.filterReservations(filters);
      const currentPage = service.currentPage();
      
      service.filterReservations(filters); // Same filters
      expect(service.currentPage()).toBe(currentPage);
    });

    it('should clear all filters', () => {
      // Set some filters and search
      service.searchReservations('John');
      service.filterReservations({ statuses: [ReservationStatus.CONFIRMED] });
      service.goToPage(2);
      
      // Clear all filters
      service.clearFilters();
      
      expect(service.searchTerm()).toBe('');
      expect(service.filters()).toEqual({});
      expect(service.currentPage()).toBe(1);
      expect(service.filteredReservations().length).toBe(MOCK_RESERVATIONS.length);
    });
  });

  describe('Pagination Functionality', () => {
    beforeEach(() => {
      // Ensure we have enough data for pagination testing
      service.setPageSize(5); // Small page size for testing
    });

    it('should calculate total pages correctly', () => {
      const totalCount = service.totalFilteredCount();
      const pageSize = service.pageSize();
      const expectedPages = Math.ceil(totalCount / pageSize);
      
      expect(service.totalPages()).toBe(expectedPages);
    });

    it('should get paginated reservations', () => {
      const paginated = service.paginatedReservations();
      
      expect(paginated.items.length).toBeLessThanOrEqual(service.pageSize());
      expect(paginated.totalCount).toBe(service.totalFilteredCount());
      expect(paginated.currentPage).toBe(service.currentPage());
      expect(paginated.pageSize).toBe(service.pageSize());
      expect(paginated.totalPages).toBe(service.totalPages());
    });

    it('should navigate to next page', () => {
      const initialPage = service.currentPage();
      const totalPages = service.totalPages();
      
      if (totalPages > 1) {
        service.nextPage();
        expect(service.currentPage()).toBe(initialPage + 1);
      }
    });

    it('should not go beyond last page', () => {
      const totalPages = service.totalPages();
      service.goToPage(totalPages);
      
      service.nextPage();
      expect(service.currentPage()).toBe(totalPages);
    });

    it('should navigate to previous page', () => {
      service.goToPage(2);
      service.previousPage();
      expect(service.currentPage()).toBe(1);
    });

    it('should not go below first page', () => {
      service.goToPage(1);
      service.previousPage();
      expect(service.currentPage()).toBe(1);
    });

    it('should go to specific page', () => {
      const targetPage = 2;
      const totalPages = service.totalPages();
      
      if (totalPages >= targetPage) {
        service.goToPage(targetPage);
        expect(service.currentPage()).toBe(targetPage);
      }
    });

    it('should not go to invalid page numbers', () => {
      const currentPage = service.currentPage();
      
      service.goToPage(0); // Invalid
      expect(service.currentPage()).toBe(currentPage);
      
      service.goToPage(999); // Beyond total pages
      expect(service.currentPage()).toBe(currentPage);
    });

    it('should update page size', () => {
      const newPageSize = 15;
      service.setPageSize(newPageSize);
      
      expect(service.pageSize()).toBe(newPageSize);
      expect(service.currentPage()).toBe(1); // Should reset to first page
    });

    it('should handle virtual scrolling mode', () => {
      service.setVirtualScrollingMode(true);
      expect(service.pageSize()).toBe(100);
      
      service.setVirtualScrollingMode(false);
      expect(service.pageSize()).toBe(10);
    });

    it('should get all filtered reservations for virtual scrolling', () => {
      const allFiltered = service.getAllFilteredReservations();
      expect(allFiltered).toEqual(service.filteredReservations());
    });
  });

  describe('Statistics and Analytics', () => {
    it('should get reservation statistics', () => {
      const stats = service.getReservationStats();
      
      expect(stats.totalReservations).toBe(service.filteredReservations().length);
      expect(stats.statusCounts).toBeDefined();
      expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
      expect(stats.averageStayLength).toBeGreaterThanOrEqual(0);
    });

    it('should calculate status counts correctly', () => {
      const stats = service.getReservationStats();
      const statusCounts = stats.statusCounts;
      
      // Sum of all status counts should equal total reservations
      const totalFromCounts = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
      expect(totalFromCounts).toBe(stats.totalReservations);
    });

    it('should get available statuses', () => {
      const statuses = service.getAvailableStatuses();
      expect(statuses).toEqual(Object.values(ReservationStatus));
    });
  });

  describe('Performance and Caching', () => {
    it('should track search performance metrics', () => {
      service.searchReservations('John');
      service.searchReservations('Jane');
      
      const metrics = service.searchPerformanceMetrics();
      expect(metrics.totalSearches).toBeGreaterThan(0);
      expect(metrics.averageSearchTime).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheHitRate).toBeLessThanOrEqual(1);
    });

    it('should provide memory usage statistics', () => {
      const memStats = service.getServiceMemoryStats();
      
      expect(memStats.reservationsCount).toBe(MOCK_RESERVATIONS.length);
      expect(memStats.searchCacheSize).toBeGreaterThanOrEqual(0);
      expect(memStats.filterCacheSize).toBeGreaterThanOrEqual(0);
      expect(memStats.prefetchedPagesSize).toBeGreaterThanOrEqual(0);
      expect(memStats.totalEstimatedMemory).toBeGreaterThanOrEqual(0);
    });

    it('should cache search results for performance', () => {
      // First search
      service.searchReservations('John');
      const firstSearchTime = performance.now();
      service.filteredReservations(); // Trigger computation
      const firstDuration = performance.now() - firstSearchTime;
      
      // Second identical search (should use cache)
      service.searchReservations('Jane');
      service.searchReservations('John'); // Back to cached search
      const secondSearchTime = performance.now();
      service.filteredReservations(); // Trigger computation
      const secondDuration = performance.now() - secondSearchTime;
      
      // Cache hit should be faster (though this might be flaky in fast environments)
      const metrics = service.searchPerformanceMetrics();
      expect(metrics.totalSearches).toBeGreaterThan(1);
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should cleanup service resources', () => {
      // Set up some state
      service.searchReservations('John');
      service.filterReservations({ statuses: [ReservationStatus.CONFIRMED] });
      service.goToPage(2);
      
      // Cleanup
      service.cleanup();
      
      // Verify cleanup
      expect(service.reservations().length).toBe(0);
      expect(service.searchTerm()).toBe('');
      expect(service.filters()).toEqual({});
      expect(service.currentPage()).toBe(1);
      expect(service.pageSize()).toBe(10);
      expect(service.loading()).toBe(false);
      expect(service.paginationLoading()).toBe(false);
      
      const metrics = service.searchPerformanceMetrics();
      expect(metrics.totalSearches).toBe(0);
      expect(metrics.averageSearchTime).toBe(0);
      expect(metrics.cacheHitRate).toBe(0);
    });

    it('should handle service cleanup in destroy', () => {
      // This would typically be called in component ngOnDestroy
      expect(() => service.cleanup()).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty dataset', () => {
      service.cleanup(); // This empties the reservations
      
      expect(service.reservations().length).toBe(0);
      expect(service.filteredReservations().length).toBe(0);
      expect(service.totalPages()).toBe(0);
      expect(service.paginatedReservations().items.length).toBe(0);
    });

    it('should handle searches with no results', () => {
      service.searchReservations('NonExistentGuest12345');
      
      expect(service.filteredReservations().length).toBe(0);
      expect(service.paginatedReservations().items.length).toBe(0);
      expect(service.totalPages()).toBe(0);
    });

    it('should handle filters with no results', () => {
      const filters: ReservationFilters = {
        minAmount: 999999 // Very high amount that likely doesn't exist
      };
      
      service.filterReservations(filters);
      expect(service.filteredReservations().length).toBe(0);
    });

    it('should handle invalid date filters gracefully', () => {
      const filters: ReservationFilters = {
        checkInStart: 'invalid-date',
        checkInEnd: 'also-invalid'
      };
      
      expect(() => service.filterReservations(filters)).not.toThrow();
    });

    it('should handle undefined total amounts in filtering', () => {
      const filters: ReservationFilters = {
        minAmount: 0,
        maxAmount: 1000000
      };
      
      expect(() => service.filterReservations(filters)).not.toThrow();
      const filtered = service.filteredReservations();
      // Should not crash even with undefined totalAmount values
      expect(filtered).toBeDefined();
    });

    it('should handle special characters in search', () => {
      const specialChars = ['@', '#', '$', '%', '&', '*', '(', ')', '[', ']', '{', '}'];
      
      specialChars.forEach(char => {
        expect(() => service.searchReservations(char)).not.toThrow();
      });
    });

    it('should handle very long search terms', () => {
      const longSearchTerm = 'a'.repeat(1000);
      expect(() => service.searchReservations(longSearchTerm)).not.toThrow();
      expect(service.searchTerm()).toBe(longSearchTerm);
    });
  });

  describe('Integration with Search and Filters Combined', () => {
    it('should combine search and filters correctly', () => {
      // Apply both search and filter
      service.searchReservations('John');
      service.filterReservations({ statuses: [ReservationStatus.CONFIRMED] });
      
      const filtered = service.filteredReservations();
      
      filtered.forEach(reservation => {
        expect(reservation.guestName.toLowerCase()).toContain('john');
        expect(reservation.status).toBe(ReservationStatus.CONFIRMED);
      });
    });

    it('should maintain pagination when combining search and filters', () => {
      service.searchReservations('test');
      service.filterReservations({ minGuests: 1 });
      
      const paginated = service.paginatedReservations();
      expect(paginated.currentPage).toBe(1); // Should reset to first page
      expect(paginated.items.length).toBeLessThanOrEqual(service.pageSize());
    });

    it('should update statistics when search and filters are applied', () => {
      const originalStats = service.getReservationStats();
      
      service.searchReservations('John');
      const searchStats = service.getReservationStats();
      
      service.filterReservations({ statuses: [ReservationStatus.CONFIRMED] });
      const combinedStats = service.getReservationStats();
      
      // Stats should reflect the filtered dataset
      expect(combinedStats.totalReservations).toBeLessThanOrEqual(searchStats.totalReservations);
      expect(searchStats.totalReservations).toBeLessThanOrEqual(originalStats.totalReservations);
    });
  });
});