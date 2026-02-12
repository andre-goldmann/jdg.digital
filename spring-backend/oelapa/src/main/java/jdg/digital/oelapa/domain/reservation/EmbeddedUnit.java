package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a lightweight unit reference without full entity loading.
 * Contains specific room or unit information assigned to a reservation.
 */
@Data
public class EmbeddedUnit {

    /**
     * Unit unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Unit name or number (e.g., "A.101", "Room 205").
     */
    @NotBlank
    @Size(max = 50)
    private String name;

    /**
     * Unit description.
     */
    @Size(max = 500)
    private String description;

    /**
     * Reference to the unit group this unit belongs to.
     */
    @NotBlank
    @Size(max = 50)
    private String unitGroupId;

    /**
     * Floor number where the unit is located.
     */
    private Integer floor;

    /**
     * Unit features or amenities (brief description).
     */
    @Size(max = 200)
    private String features;

    /**
     * Current maintenance status of the unit.
     */
    private UnitStatus status;

    /**
     * Unit maintenance status enumeration.
     */
    public enum UnitStatus {
        AVAILABLE("Available"),
        OCCUPIED("Occupied"),
        OUT_OF_ORDER("OutOfOrder"),
        MAINTENANCE("Maintenance"),
        DIRTY("Dirty"),
        CLEAN("Clean");

        private final String value;

        UnitStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}