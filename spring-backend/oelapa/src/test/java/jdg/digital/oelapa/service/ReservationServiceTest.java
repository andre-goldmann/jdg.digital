package jdg.digital.oelapa.service;

import jdg.digital.oelapa.domain.reservation.ChannelCode;
import jdg.digital.oelapa.domain.reservation.GuaranteeType;
import jdg.digital.oelapa.domain.reservation.Reservation;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import jdg.digital.oelapa.dto.ReservationListModel;
import jdg.digital.oelapa.dto.ReservationItemModel;
import jdg.digital.oelapa.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * TDD Test for ReservationService.
 * RED phase: These tests should fail until the service is implemented.
 */
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ReservationMapper reservationMapper;

    @InjectMocks
    private ReservationService reservationService;

    private Reservation testReservation1;
    private Reservation testReservation2;
    private Reservation testReservation3;
    private ReservationItemModel testModel1;
    private ReservationItemModel testModel2;
    private ReservationItemModel testModel3;

    @BeforeEach
    void setUp() {
        // Setup test data
        testReservation1 = createReservation(1L, "BOOKING001", ReservationStatus.CONFIRMED, 
                "PROP001", LocalDateTime.now().plusDays(1), ChannelCode.DIRECT);
        testReservation2 = createReservation(2L, "BOOKING002", ReservationStatus.IN_HOUSE, 
                "PROP001", LocalDateTime.now().minusDays(1), ChannelCode.IBE);
        testReservation3 = createReservation(3L, "BOOKING003", ReservationStatus.CONFIRMED, 
                "PROP002", LocalDateTime.now().plusDays(5), ChannelCode.BOOKING_COM);

        testModel1 = createModel("BOOKING001", ReservationStatus.CONFIRMED);
        testModel2 = createModel("BOOKING002", ReservationStatus.IN_HOUSE);
        testModel3 = createModel("BOOKING003", ReservationStatus.CONFIRMED);
    }

    @Test
    void shouldReturnAllReservations_whenNoFiltersApplied() {
        // GIVEN: Repository returns all reservations
        List<Reservation> allReservations = Arrays.asList(testReservation1, testReservation2, testReservation3);
        Page<Reservation> page = new PageImpl<>(allReservations);
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);
        when(reservationMapper.toDto(testReservation2)).thenReturn(testModel2);
        when(reservationMapper.toDto(testReservation3)).thenReturn(testModel3);

        // WHEN: Getting all reservations with no filters
        ReservationListModel result = reservationService.getAllReservations(null, null, null, 
                null, null, null, null, null, null, null, null, 0, 100);

        // THEN: Should return all 3 reservations
        assertThat(result).isNotNull();
        assertThat(result.getReservations()).hasSize(3);
        assertThat(result.getCount()).isEqualTo(3);
        verify(reservationRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    void shouldFilterByStatus_whenStatusProvided() {
        // GIVEN: Repository returns only CONFIRMED reservations
        List<Reservation> confirmedReservations = Arrays.asList(testReservation1, testReservation3);
        Page<Reservation> page = new PageImpl<>(confirmedReservations);
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);
        when(reservationMapper.toDto(testReservation3)).thenReturn(testModel3);

        // WHEN: Filtering by CONFIRMED status
        ReservationListModel result = reservationService.getAllReservations(
                Collections.singletonList(ReservationStatus.CONFIRMED), 
                null, null, null, null, null, null, null, null, null, null, 0, 100);

        // THEN: Should return only CONFIRMED reservations
        assertThat(result.getReservations()).hasSize(2);
        assertThat(result.getReservations()).extracting("status")
                .containsOnly(ReservationStatus.CONFIRMED);
    }

    @Test
    void shouldFilterByBookingId_whenBookingIdProvided() {
        // GIVEN: Repository returns reservation with specific booking ID
        Page<Reservation> page = new PageImpl<>(Collections.singletonList(testReservation1));
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);

        // WHEN: Filtering by booking ID
        ReservationListModel result = reservationService.getAllReservations(
                null, "BOOKING001", null, null, null, null, null, null, null, null, null, 0, 100);

        // THEN: Should return only the reservation with matching booking ID
        assertThat(result.getReservations()).hasSize(1);
        assertThat(result.getReservations().get(0).getBookingId()).isEqualTo("BOOKING001");
    }

    @Test
    void shouldFilterByPropertyIds_whenMultiplePropertiesProvided() {
        // GIVEN: Repository returns reservations from specified properties
        List<Reservation> propertyReservations = Arrays.asList(testReservation1, testReservation2);
        Page<Reservation> page = new PageImpl<>(propertyReservations);
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);
        when(reservationMapper.toDto(testReservation2)).thenReturn(testModel2);

        // WHEN: Filtering by property IDs
        ReservationListModel result = reservationService.getAllReservations(
                null, null, Arrays.asList("PROP001"), null, null, null, null, null, null, null, null, 0, 100);

        // THEN: Should return only reservations from PROP001
        assertThat(result.getReservations()).hasSize(2);
    }

    @Test
    void shouldFilterByArrivalDateRange_whenDatesProvided() {
        // GIVEN: Repository returns reservations with arrival in date range
        Page<Reservation> page = new PageImpl<>(Collections.singletonList(testReservation1));
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);

        // WHEN: Filtering by arrival date range
        LocalDate from = LocalDate.now();
        LocalDate to = LocalDate.now().plusDays(7);
        ReservationListModel result = reservationService.getAllReservations(
                null, null, null, from, to, "Arrival", null, null, null, null, null, 0, 100);

        // THEN: Should return reservations arriving in date range
        assertThat(result.getReservations()).hasSize(1);
    }

    @Test
    void shouldFilterByDepartureDateRange_whenDatesAndFilterProvided() {
        // GIVEN: Repository returns reservations with departure in date range
        Page<Reservation> page = new PageImpl<>(Collections.singletonList(testReservation3));
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation3)).thenReturn(testModel3);

        // WHEN: Filtering by departure date range
        LocalDate from = LocalDate.now().plusDays(4);
        LocalDate to = LocalDate.now().plusDays(10);
        ReservationListModel result = reservationService.getAllReservations(
                null, null, null, from, to, "Departure", null, null, null, null, null, 0, 100);

        // THEN: Should return reservations departing in date range
        assertThat(result.getReservations()).hasSize(1);
    }

    @Test
    void shouldFilterByChannelCode_whenChannelProvided() {
        // GIVEN: Repository returns reservations from specific channel
        Page<Reservation> page = new PageImpl<>(Collections.singletonList(testReservation1));
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);

        // WHEN: Filtering by channel code
        ReservationListModel result = reservationService.getAllReservations(
                null, null, null, null, null, null, 
                Collections.singletonList(ChannelCode.DIRECT), null, null, null, null, 0, 100);

        // THEN: Should return only DIRECT channel reservations
        assertThat(result.getReservations()).hasSize(1);
    }

    @Test
    void shouldSearchByText_whenTextSearchProvided() {
        // GIVEN: Repository returns reservations matching text search
        Page<Reservation> page = new PageImpl<>(Collections.singletonList(testReservation1));
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);

        // WHEN: Searching by text
        ReservationListModel result = reservationService.getAllReservations(
                null, null, null, null, null, null, null, "John", null, null, null, 0, 100);

        // THEN: Should return reservations matching search term
        assertThat(result.getReservations()).hasSize(1);
    }

    @Test
    void shouldApplyPagination_whenPageParametersProvided() {
        // GIVEN: Repository returns paginated results
        List<Reservation> pageReservations = Collections.singletonList(testReservation2);
        Page<Reservation> page = new PageImpl<>(pageReservations, PageRequest.of(1, 1), 3);

        when(reservationRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(reservationMapper.toDto(testReservation2)).thenReturn(testModel2);

        // WHEN: Requesting specific page
        ReservationListModel result = reservationService.getAllReservations(
                null, null, null, null, null, null, null, null, null, null, null, 1, 1);

        // THEN: Should return paginated results
        assertThat(result.getReservations()).hasSize(1);
        assertThat(result.getCount()).isEqualTo(3); // Total count across all pages
        verify(reservationRepository).findAll(any(Specification.class), eq(PageRequest.of(1, 1)));
    }

    @Test
    void shouldCombineMultipleFilters_whenMultipleFiltersProvided() {
        // GIVEN: Repository returns reservations matching all filters
        Page<Reservation> page = new PageImpl<>(Collections.singletonList(testReservation1));
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(testReservation1)).thenReturn(testModel1);

        // WHEN: Applying multiple filters
        ReservationListModel result = reservationService.getAllReservations(
                Collections.singletonList(ReservationStatus.CONFIRMED),
                null,
                Collections.singletonList("PROP001"),
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                "Arrival",
                Collections.singletonList(ChannelCode.DIRECT),
                null, null, null, null, 0, 100);

        // THEN: Should return reservations matching all criteria
        assertThat(result.getReservations()).hasSize(1);
    }

    @Test
    void shouldReturnEmptyList_whenNoReservationsMatchFilters() {
        // GIVEN: Repository returns empty result
        Page<Reservation> emptyPage = new PageImpl<>(Collections.emptyList());
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(emptyPage);

        // WHEN: Applying filters that match no reservations
        ReservationListModel result = reservationService.getAllReservations(
                Collections.singletonList(ReservationStatus.CANCELED),
                "NONEXISTENT",
                null, null, null, null, null, null, null, null, null, 0, 100);

        // THEN: Should return empty list
        assertThat(result.getReservations()).isEmpty();
        assertThat(result.getCount()).isEqualTo(0);
    }

    @Test
    void shouldHandleNullFilters_gracefully() {
        // GIVEN: Repository handles null specifications
        List<Reservation> allReservations = Arrays.asList(testReservation1, testReservation2);
        Page<Reservation> page = new PageImpl<>(allReservations);
        Pageable pageable = PageRequest.of(0, 100);

        when(reservationRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(reservationMapper.toDto(any())).thenReturn(testModel1, testModel2);

        // WHEN: All filters are null
        ReservationListModel result = reservationService.getAllReservations(
                null, null, null, null, null, null, null, null, null, null, null, 0, 100);

        // THEN: Should return all reservations without errors
        assertThat(result.getReservations()).hasSize(2);
    }

    // Helper methods
    private Reservation createReservation(Long id, String bookingId, ReservationStatus status, 
                                         String propertyId, LocalDateTime arrival, ChannelCode channel) {
        return Reservation.builder()
                .id(id)
                .bookingId(bookingId)
                .status(status)
                .propertyId(propertyId)
                .arrival(arrival)
                .departure(arrival.plusDays(2))
                .adults(2)
                .channelCode(channel)
                .guaranteeType(GuaranteeType.CREDIT_CARD)
                .hasCityTax(false)
                .isPreCheckedIn(false)
                .isOpenForCharges(true)
                .primaryGuestFirstName("John")
                .primaryGuestLastName("Doe")
                .build();
    }

    private ReservationItemModel createModel(String bookingId, ReservationStatus status) {
        ReservationItemModel model = new ReservationItemModel();
        model.setBookingId(bookingId);
        model.setStatus(status);
        return model;
    }
}
