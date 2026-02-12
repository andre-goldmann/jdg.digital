package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents external system references for reservation synchronization.
 * Contains identifiers used by various external booking and management systems.
 */
@Data
public class ExternalReferences {

    /**
     * Global Distribution System identifier.
     */
    @Size(max = 100)
    private String globalDistributionSystemId;

    /**
     * Online Travel Agency identifier (e.g., Booking.com, Expedia).
     */
    @Size(max = 100)
    private String onlineTravelAgencyId;

    /**
     * Online Booking Tool identifier.
     */
    @Size(max = 200)
    private String onlineBookingToolId;

    /**
     * Channel Manager system identifier.
     */
    @Size(max = 100)
    private String channelManagerId;

    /**
     * Central Reservation System identifier.
     */
    @Size(max = 100)
    private String centralReservationSystemId;

    /**
     * Legacy system identifier (for migration purposes).
     */
    @Size(max = 100)
    private String legacyId;

    /**
     * Property Management System identifier.
     */
    @Size(max = 100)
    private String propertyManagementSystemId;

    /**
     * Customer Relationship Management system identifier.
     */
    @Size(max = 100)
    private String crmId;

    /**
     * Revenue Management System identifier.
     */
    @Size(max = 100)
    private String revenueManagementSystemId;
}