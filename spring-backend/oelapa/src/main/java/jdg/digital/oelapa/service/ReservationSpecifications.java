package jdg.digital.oelapa.service;

import jdg.digital.oelapa.domain.reservation.ChannelCode;
import jdg.digital.oelapa.domain.reservation.Reservation;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specifications for building dynamic queries on Reservation entities.
 */
public class ReservationSpecifications {

    /**
     * Creates a specification that combines all provided filters.
     */
    public static Specification<Reservation> withFilters(
            List<ReservationStatus> status,
            String bookingId,
            List<String> propertyIds,
            LocalDate from,
            LocalDate to,
            String dateFilter,
            List<ChannelCode> channelCodes,
            String textSearch,
            List<String> unitGroupIds,
            List<String> unitIds) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by status
            if (status != null && !status.isEmpty()) {
                predicates.add(root.get("status").in(status));
            }

            // Filter by booking ID
            if (bookingId != null && !bookingId.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("bookingId"), bookingId));
            }

            // Filter by property IDs
            if (propertyIds != null && !propertyIds.isEmpty()) {
                predicates.add(root.get("propertyId").in(propertyIds));
            }

            // Filter by date range
            if (from != null && to != null && dateFilter != null) {
                LocalDateTime fromDateTime = from.atStartOfDay();
                LocalDateTime toDateTime = to.plusDays(1).atStartOfDay();

                switch (dateFilter.toLowerCase()) {
                    case "arrival":
                        predicates.add(criteriaBuilder.between(root.get("arrival"), fromDateTime, toDateTime));
                        break;
                    case "departure":
                        predicates.add(criteriaBuilder.between(root.get("departure"), fromDateTime, toDateTime));
                        break;
                    case "stay":
                        // Reservation overlaps with date range
                        predicates.add(criteriaBuilder.and(
                                criteriaBuilder.lessThanOrEqualTo(root.get("arrival"), toDateTime),
                                criteriaBuilder.greaterThanOrEqualTo(root.get("departure"), fromDateTime)
                        ));
                        break;
                    case "creation":
                        predicates.add(criteriaBuilder.between(root.get("created"), fromDateTime, toDateTime));
                        break;
                    case "modification":
                        predicates.add(criteriaBuilder.between(root.get("modified"), fromDateTime, toDateTime));
                        break;
                }
            }

            // Filter by channel codes
            if (channelCodes != null && !channelCodes.isEmpty()) {
                predicates.add(root.get("channelCode").in(channelCodes));
            }

            // Text search across multiple fields
            if (textSearch != null && !textSearch.trim().isEmpty()) {
                String searchPattern = "%" + textSearch.toLowerCase() + "%";
                Predicate bookingIdMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("bookingId")), searchPattern);
                Predicate firstNameMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("primaryGuestFirstName")), searchPattern);
                Predicate lastNameMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("primaryGuestLastName")), searchPattern);
                Predicate emailMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("primaryGuestEmail")), searchPattern);

                predicates.add(criteriaBuilder.or(bookingIdMatch, firstNameMatch, lastNameMatch, emailMatch));
            }

            // Filter by unit group IDs
            if (unitGroupIds != null && !unitGroupIds.isEmpty()) {
                predicates.add(root.get("unitGroupId").in(unitGroupIds));
            }

            // Filter by unit IDs
            if (unitIds != null && !unitIds.isEmpty()) {
                predicates.add(root.get("unitId").in(unitIds));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
