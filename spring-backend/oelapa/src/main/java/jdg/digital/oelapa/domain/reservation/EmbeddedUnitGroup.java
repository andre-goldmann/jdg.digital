package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a lightweight unit group reference without full entity loading.
 * Contains room type or unit category information.
 */
@Data
public class EmbeddedUnitGroup {

    /**
     * Unit group unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Unit group code (usually short identifier like SGL, DBL, STE).
     */
    @NotBlank
    @Size(max = 20)
    private String code;

    /**
     * Unit group display name (e.g., "Single Room", "Double Room").
     */
    @NotBlank
    @Size(max = 100)
    private String name;

    /**
     * Unit group description.
     */
    @Size(max = 500)
    private String description;

    /**
     * Type of unit group (BedRoom, MeetingRoom, Apartment, etc.).
     */
    @Size(max = 50)
    private String type;

    /**
     * Maximum occupancy for this unit group.
     */
    private Integer maxOccupancy;

    /**
     * Standard number of beds in this unit group.
     */
    private Integer bedCount;
}