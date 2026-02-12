package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

/**
 * Represents a service included in a reservation time slice.
 * Tracks services provided to guests during their stay.
 */
@Data
public class IncludedService {

    /**
     * Service information.
     */
    @Valid
    @NotNull
    private EmbeddedService service;

    /**
     * Date when the service is provided.
     */
    @NotNull
    private LocalDate serviceDate;

    /**
     * Quantity or count of the service (e.g., number of people for breakfast).
     */
    @NotNull
    @PositiveOrZero
    private Integer count;

    /**
     * Amount for this service instance.
     */
    @Valid
    @NotNull
    private BaseAmount amount;

    /**
     * Whether this service was booked as an extra (not included in the rate).
     */
    @NotNull
    private Boolean bookedAsExtra;

    /**
     * Service consumption status.
     */
    private ServiceStatus status;

    /**
     * Additional notes about the service.
     */
    private String notes;

    /**
     * Service consumption status enumeration.
     */
    public enum ServiceStatus {
        PENDING("Pending"),
        CONSUMED("Consumed"),
        CANCELLED("Cancelled"),
        NO_SHOW("NoShow");

        private final String value;

        ServiceStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}