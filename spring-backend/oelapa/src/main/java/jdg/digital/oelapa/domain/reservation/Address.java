package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents guest address information with international support.
 * Supports multiple address lines and international addressing formats.
 */
@Data
public class Address {

    /**
     * Primary address line (street, number, etc.).
     */
    @NotBlank
    @Size(max = 255)
    private String addressLine1;

    /**
     * Secondary address line (apartment, suite, etc.).
     */
    @Size(max = 255)
    private String addressLine2;

    /**
     * Postal or ZIP code.
     */
    @Size(max = 20)
    private String postalCode;

    /**
     * City name.
     */
    @NotBlank
    @Size(max = 100)
    private String city;

    /**
     * State or province (optional for international addresses).
     */
    @Size(max = 100)
    private String state;

    /**
     * ISO 3166-1 alpha-2 country code (e.g., "DE", "US", "GB").
     */
    @NotBlank
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country code must be a valid 2-letter ISO 3166-1 alpha-2 code")
    private String countryCode;
}