package jdg.digital.oelapa.service;

import jdg.digital.oelapa.domain.reservation.Reservation;
import jdg.digital.oelapa.dto.ReservationItemModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

/**
 * MapStruct mapper for converting between Reservation entity and ReservationItemModel DTO.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ReservationMapper {

    /**
     * Converts a Reservation entity to a ReservationItemModel DTO.
     * Note: This is a simplified mapping for list views.
     *
     * @param reservation the entity to convert
     * @return the DTO representation
     */
    @Mapping(target = "id", expression = "java(reservation.getId() != null ? reservation.getId().toString() : null)")
    @Mapping(target = "bookingId", source = "bookingId")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "arrival", source = "arrival")
    @Mapping(target = "departure", source = "departure")
    @Mapping(target = "created", source = "created")
    @Mapping(target = "modified", source = "modified")
    @Mapping(target = "adults", source = "adults")
    @Mapping(target = "childrenAges", ignore = true)       // Type conversion deferred
    @Mapping(target = "property", ignore = true)           // Complex object mapping deferred
    @Mapping(target = "ratePlan", ignore = true)          // Complex object mapping deferred
    @Mapping(target = "unitGroup", ignore = true)         // Complex object mapping deferred
    @Mapping(target = "totalGrossAmount", ignore = true)  // Complex type mapping deferred
    @Mapping(target = "unit", ignore = true)              // Complex object mapping deferred
    @Mapping(target = "primaryGuest", ignore = true)      // Complex object mapping deferred
    @Mapping(target = "timeSlices", ignore = true)        // Not in simplified entity
    @Mapping(target = "services", ignore = true)          // Not in simplified entity
    @Mapping(target = "balance", ignore = true)           // Complex type mapping deferred
    @Mapping(target = "company", ignore = true)           // Not in simplified entity
    @Mapping(target = "marketSegment", ignore = true)     // Not in simplified entity
    @Mapping(target = "additionalGuests", ignore = true)  // Not in simplified entity
    @Mapping(target = "booker", ignore = true)            // Not in simplified entity
    @Mapping(target = "paymentAccount", ignore = true)    // Not in simplified entity
    @Mapping(target = "registeredCard", ignore = true)    // Not in simplified entity
    @Mapping(target = "cancellationFee", ignore = true)   // Not in simplified entity
    @Mapping(target = "noShowFee", ignore = true)         // Not in simplified entity
    @Mapping(target = "assignedUnits", ignore = true)     // Not in simplified entity
    @Mapping(target = "validationMessages", ignore = true) // Not in simplified entity
    @Mapping(target = "actions", ignore = true)            // Not in simplified entity
    @Mapping(target = "commission", ignore = true)         // Not in simplified entity
    @Mapping(target = "externalReferences", ignore = true) // Not in simplified entity
    ReservationItemModel toDto(Reservation reservation);

    /**
     * Converts a list of Reservation entities to a list of ReservationItemModel DTOs.
     *
     * @param reservations the entities to convert
     * @return the DTO representations
     */
    List<ReservationItemModel> toDtoList(List<Reservation> reservations);
}
