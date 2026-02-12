package jdg.digital.oelapa.service;

import jdg.digital.oelapa.domain.reservation.ChannelCode;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import jdg.digital.oelapa.dto.ReservationListModel;
import jdg.digital.oelapa.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Service for managing reservations.
 * Handles business logic and filtering for reservation queries.
 */
@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    public ReservationService(ReservationRepository reservationRepository, 
                            ReservationMapper reservationMapper) {
        this.reservationRepository = reservationRepository;
        this.reservationMapper = reservationMapper;
    }

    /**
     * Gets all reservations with optional filtering and pagination.
     *
     * @param status         filter by reservation status(es)
     * @param bookingId      filter by booking ID
     * @param propertyIds    filter by property ID(s)
     * @param from           start date for date range filter
     * @param to             end date for date range filter
     * @param dateFilter     type of date filter (Arrival, Departure, Stay, Creation, Modification)
     * @param channelCodes   filter by channel code(s)
     * @param textSearch     search text across multiple fields
     * @param unitGroupIds   filter by unit group ID(s)
     * @param unitIds        filter by unit ID(s)
     * @param expand         fields to expand in response
     * @param pageNumber     page number (0-indexed)
     * @param pageSize       number of items per page
     * @return paginated list of reservations
     */
    public ReservationListModel getAllReservations(
            List<ReservationStatus> status,
            String bookingId,
            List<String> propertyIds,
            LocalDate from,
            LocalDate to,
            String dateFilter,
            List<ChannelCode> channelCodes,
            String textSearch,
            List<String> unitGroupIds,
            List<String> unitIds,
            List<String> expand,
            int pageNumber,
            int pageSize) {
        
        // Build specification from filters
        var specification = ReservationSpecifications.withFilters(
                status, bookingId, propertyIds, from, to, dateFilter,
                channelCodes, textSearch, unitGroupIds, unitIds);

        // Create pageable
        var pageable = org.springframework.data.domain.PageRequest.of(pageNumber, pageSize);

        // Query database
        var page = reservationRepository.findAll(specification, pageable);

        // Map to DTOs
        var reservationModels = page.getContent().stream()
                .map(reservationMapper::toDto)
                .toList();

        // Build response
        var response = new ReservationListModel();
        response.setReservations(reservationModels);
        response.setCount(page.getTotalElements());

        return response;
    }
}
