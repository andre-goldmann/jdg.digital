package jdg.digital.oelapa.repository;

import jdg.digital.oelapa.domain.reservation.Reservation;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Reservation entity.
 * Provides CRUD operations and custom query methods for reservation management.
 * 
 * Extends JpaSpecificationExecutor to support dynamic queries with Specifications.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation> {

    /**
     * Find all reservations with a specific status.
     *
     * @param status the reservation status to filter by
     * @return list of reservations with the specified status
     */
    List<Reservation> findByStatus(ReservationStatus status);

    /**
     * Find all reservations for a specific booking ID.
     *
     * @param bookingId the booking ID to search for
     * @return list of reservations with the specified booking ID
     */
    List<Reservation> findByBookingId(String bookingId);

    /**
     * Find all reservations for a specific property.
     *
     * @param propertyId the property ID to filter by
     * @return list of reservations for the specified property
     */
    List<Reservation> findByPropertyId(String propertyId);
}
