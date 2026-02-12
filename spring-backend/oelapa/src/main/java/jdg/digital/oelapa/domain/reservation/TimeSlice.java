package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a daily time slice for multi-day reservations.
 * Breaks down reservations into daily segments for detailed pricing and service tracking.
 */
@Data
public class TimeSlice {

    /**
     * Start date and time of this time slice.
     */
    @NotNull
    private LocalDateTime from;

    /**
     * End date and time of this time slice.
     */
    @NotNull
    private LocalDateTime to;

    /**
     * Service date for this time slice (usually the date for which services are provided).
     */
    @NotNull
    private LocalDate serviceDate;

    /**
     * Rate plan applicable for this time slice.
     */
    @Valid
    @NotNull
    private EmbeddedRatePlan ratePlan;

    /**
     * Unit group for this time slice.
     */
    @Valid
    @NotNull
    private EmbeddedUnitGroup unitGroup;

    /**
     * Specific unit assigned for this time slice (if assigned).
     */
    @Valid
    private EmbeddedUnit unit;

    /**
     * Base pricing information for this time slice.
     */
    @Valid
    @NotNull
    private BaseAmount baseAmount;

    /**
     * Total gross amount for this time slice.
     */
    @Valid
    @NotNull
    private MonetaryValue totalGrossAmount;

    /**
     * Services included in this time slice.
     */
    @Valid
    private List<IncludedService> includedServices;

    /**
     * Additional notes for this time slice.
     */
    private String notes;
}