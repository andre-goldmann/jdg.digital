package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents guest vehicle registration information.
 * Used for parking management and guest services.
 */
@Data
public class VehicleRegistration {

    /**
     * Vehicle registration/license plate number.
     */
    @NotBlank
    @Size(max = 20)
    private String number;

    /**
     * ISO 3166-1 alpha-2 country code where the vehicle is registered.
     */
    @NotBlank
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country code must be a valid 2-letter ISO 3166-1 alpha-2 code")
    private String countryCode;

    /**
     * Additional vehicle information (make, model, color, etc.).
     */
    @Size(max = 255)
    private String description;
}