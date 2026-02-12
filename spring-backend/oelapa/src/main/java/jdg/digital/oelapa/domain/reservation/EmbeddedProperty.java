package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a lightweight property reference without full entity loading.
 * Used in reservations to maintain property information without loading complete property details.
 */
@Data
public class EmbeddedProperty {

    /**
     * Property unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Property code (usually short identifier).
     */
    @NotBlank
    @Size(max = 20)
    private String code;

    /**
     * Property display name.
     */
    @NotBlank
    @Size(max = 100)
    private String name;

    /**
     * Property description.
     */
    @Size(max = 500)
    private String description;

    /**
     * Property location or address (brief).
     */
    @Size(max = 200)
    private String location;
}