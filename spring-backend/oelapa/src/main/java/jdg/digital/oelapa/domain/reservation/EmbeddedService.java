package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a lightweight service reference without full entity loading.
 * Contains hotel service information (breakfast, spa, parking, etc.).
 */
@Data
public class EmbeddedService {

    /**
     * Service unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Service code (usually short identifier like BRKF, SPA, PARK).
     */
    @NotBlank
    @Size(max = 20)
    private String code;

    /**
     * Service display name (e.g., "Breakfast", "Spa Access").
     */
    @NotBlank
    @Size(max = 100)
    private String name;

    /**
     * Service description.
     */
    @Size(max = 500)
    private String description;

    /**
     * Service category (Food, Recreation, Transportation, etc.).
     */
    @Size(max = 50)
    private String category;

    /**
     * Whether this service is mandatory.
     */
    private Boolean isMandatory;

    /**
     * Whether this service is available for online booking.
     */
    private Boolean isBookable;

    /**
     * Service pricing type (PerPerson, PerRoom, PerStay, etc.).
     */
    @Size(max = 30)
    private String pricingType;
}