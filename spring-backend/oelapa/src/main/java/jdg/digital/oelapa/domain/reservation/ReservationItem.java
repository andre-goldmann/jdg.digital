package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a simplified reservation item for list views and search results.
 * Contains essential reservation information without heavy nested objects.
 */
@Data
public class ReservationItem {

    /**
     * Reservation unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Booking identifier that groups related reservations.
     */
    @NotBlank
    @Size(max = 50)
    private String bookingId;

    /**
     * Current status of the reservation.
     */
    @NotNull
    private ReservationStatus status;

    /**
     * Property information.
     */
    @Valid
    @NotNull
    private EmbeddedProperty property;

    /**
     * Rate plan information.
     */
    @Valid
    @NotNull
    private EmbeddedRatePlan ratePlan;

    /**
     * Unit group (room type) information.
     */
    @Valid
    @NotNull
    private EmbeddedUnitGroup unitGroup;

    /**
     * Specific unit (room) assigned to this reservation.
     */
    @Valid
    private EmbeddedUnit unit;

    /**
     * Total gross amount for the entire reservation.
     */
    @Valid
    @NotNull
    private MonetaryValue totalGrossAmount;

    /**
     * Arrival date and time.
     */
    @NotNull
    private LocalDateTime arrival;

    /**
     * Departure date and time.
     */
    @NotNull
    private LocalDateTime departure;

    /**
     * Creation timestamp.
     */
    @NotNull
    private LocalDateTime created;

    /**
     * Last modification timestamp.
     */
    @NotNull
    private LocalDateTime modified;

    /**
     * Number of adult guests.
     */
    @NotNull
    @Positive
    private Integer adults;

    /**
     * Ages of children guests.
     */
    private List<Integer> childrenAges;

    /**
     * Booking channel code.
     */
    @NotNull
    private ChannelCode channelCode;

    /**
     * Primary guest name (concatenated for display).
     */
    @NotBlank
    @Size(max = 200)
    private String primaryGuestName;

    /**
     * Primary guest email.
     */
    @Size(max = 255)
    private String primaryGuestEmail;

    /**
     * Primary guest phone.
     */
    @Size(max = 20)
    private String primaryGuestPhone;

    /**
     * Guarantee type for this reservation.
     */
    @NotNull
    private GuaranteeType guaranteeType;

    /**
     * Current balance (positive = guest owes, negative = guest credit).
     */
    @Valid
    @NotNull
    private MonetaryValue balance;

    /**
     * Company name (for corporate bookings).
     */
    @Size(max = 200)
    private String companyName;

    /**
     * Whether city tax applies to this reservation.
     */
    @NotNull
    private Boolean hasCityTax;

    /**
     * Whether guest is pre-checked in.
     */
    @NotNull
    private Boolean isPreCheckedIn;

    /**
     * Whether reservation is open for additional charges.
     */
    @NotNull
    private Boolean isOpenForCharges;

    /**
     * Brief validation status indicator.
     */
    private Boolean hasValidationIssues;

    /**
     * External reference for primary booking system.
     */
    @Size(max = 100)
    private String externalReference;
}