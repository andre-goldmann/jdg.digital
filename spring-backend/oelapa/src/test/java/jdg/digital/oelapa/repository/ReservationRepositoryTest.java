package jdg.digital.oelapa.repository;

import jdg.digital.oelapa.domain.reservation.ChannelCode;
import jdg.digital.oelapa.domain.reservation.GuaranteeType;
import jdg.digital.oelapa.domain.reservation.Reservation;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ReservationRepository using Test-Driven Development (TDD).
 * These tests use H2 in-memory database for fast testing without Docker.
 * 
 * TDD Phase 1 (RED): These tests will fail initially because Reservation entity and repository don't exist yet.
 * TDD Phase 2 (GREEN): Implement entity and repository to make tests pass.
 */
@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=true"
})
class ReservationRepositoryTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void shouldFindAllReservations_whenRepositoryIsEmpty() {
        // GIVEN: Repository is empty
        
        // WHEN: Finding all reservations
        List<Reservation> reservations = reservationRepository.findAll();
        
        // THEN: Should return empty list
        assertThat(reservations).isEmpty();
    }

    @Test
    void shouldSaveReservation_andAssignId() {
        // GIVEN: A new reservation
        Reservation reservation = Reservation.builder()
                .bookingId("BOOKING123")
                .status(ReservationStatus.CONFIRMED)
                .arrival(LocalDateTime.now().plusDays(1))
                .departure(LocalDateTime.now().plusDays(3))
                .adults(2)
                .channelCode(ChannelCode.DIRECT)
                .guaranteeType(GuaranteeType.CREDIT_CARD)
                .hasCityTax(false)
                .isPreCheckedIn(false)
                .isOpenForCharges(true)
                .build();
        
        // WHEN: Saving the reservation
        Reservation saved = reservationRepository.save(reservation);
        
        // THEN: Should be persisted with generated ID
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getBookingId()).isEqualTo("BOOKING123");
        assertThat(saved.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    void shouldFindById_whenReservationExists() {
        // GIVEN: A saved reservation
        Reservation reservation = Reservation.builder()
                .bookingId("BOOKING456")
                .status(ReservationStatus.CONFIRMED)
                .arrival(LocalDateTime.now().plusDays(1))
                .departure(LocalDateTime.now().plusDays(3))
                .adults(2)
                .channelCode(ChannelCode.DIRECT)
                .guaranteeType(GuaranteeType.CREDIT_CARD)
                .hasCityTax(false)
                .isPreCheckedIn(false)
                .isOpenForCharges(true)
                .build();
        Reservation saved = reservationRepository.save(reservation);
        
        // WHEN: Finding by ID
        Optional<Reservation> found = reservationRepository.findById(saved.getId());
        
        // THEN: Should find the reservation
        assertThat(found).isPresent();
        assertThat(found.get().getBookingId()).isEqualTo("BOOKING456");
    }

    @Test
    void shouldReturnEmptyOptional_whenReservationDoesNotExist() {
        // GIVEN: No reservation with ID 999999L
        
        // WHEN: Finding by non-existent ID
        Optional<Reservation> found = reservationRepository.findById(999999L);
        
        // THEN: Should return empty Optional
        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindByStatus() {
        // GIVEN: Reservations with different statuses
        reservationRepository.save(createReservation("BOOK1", ReservationStatus.CONFIRMED));
        reservationRepository.save(createReservation("BOOK2", ReservationStatus.CONFIRMED));
        reservationRepository.save(createReservation("BOOK3", ReservationStatus.IN_HOUSE));
        reservationRepository.save(createReservation("BOOK4", ReservationStatus.CHECKED_OUT));
        
        // WHEN: Finding by status CONFIRMED
        List<Reservation> confirmed = reservationRepository.findByStatus(ReservationStatus.CONFIRMED);
        
        // THEN: Should return only confirmed reservations
        assertThat(confirmed).hasSize(2);
        assertThat(confirmed).allMatch(r -> r.getStatus() == ReservationStatus.CONFIRMED);
    }

    @Test
    void shouldFindByBookingId() {
        // GIVEN: Multiple reservations, some with same booking ID
        reservationRepository.save(createReservation("BOOKING789", ReservationStatus.CONFIRMED));
        reservationRepository.save(createReservation("BOOKING789", ReservationStatus.IN_HOUSE));
        reservationRepository.save(createReservation("OTHER123", ReservationStatus.CONFIRMED));
        
        // WHEN: Finding by booking ID
        List<Reservation> found = reservationRepository.findByBookingId("BOOKING789");
        
        // THEN: Should return reservations with that booking ID
        assertThat(found).hasSize(2);
        assertThat(found).allMatch(r -> r.getBookingId().equals("BOOKING789"));
    }

    @Test
    void shouldSupportPagination() {
        // GIVEN: 25 reservations
        for (int i = 0; i < 25; i++) {
            reservationRepository.save(createReservation("BOOK" + i, ReservationStatus.CONFIRMED));
        }
        
        // WHEN: Requesting first page with 10 items
        Page<Reservation> firstPage = reservationRepository.findAll(PageRequest.of(0, 10));
        
        // THEN: Should return first 10 items
        assertThat(firstPage.getContent()).hasSize(10);
        assertThat(firstPage.getTotalElements()).isEqualTo(25);
        assertThat(firstPage.getTotalPages()).isEqualTo(3);
        assertThat(firstPage.getNumber()).isEqualTo(0);
        
        // WHEN: Requesting second page
        Page<Reservation> secondPage = reservationRepository.findAll(PageRequest.of(1, 10));
        
        // THEN: Should return next 10 items
        assertThat(secondPage.getContent()).hasSize(10);
        assertThat(secondPage.getNumber()).isEqualTo(1);
        
        // WHEN: Requesting last page
        Page<Reservation> lastPage = reservationRepository.findAll(PageRequest.of(2, 10));
        
        // THEN: Should return remaining 5 items
        assertThat(lastPage.getContent()).hasSize(5);
        assertThat(lastPage.getNumber()).isEqualTo(2);
    }

    // Helper method to create test reservations
    private Reservation createReservation(String bookingId, ReservationStatus status) {
        return Reservation.builder()
                .bookingId(bookingId)
                .status(status)
                .arrival(LocalDateTime.now().plusDays(1))
                .departure(LocalDateTime.now().plusDays(3))
                .adults(2)
                .channelCode(ChannelCode.DIRECT)
                .guaranteeType(GuaranteeType.CREDIT_CARD)
                .hasCityTax(false)
                .isPreCheckedIn(false)
                .isOpenForCharges(true)
                .build();
    }
}
