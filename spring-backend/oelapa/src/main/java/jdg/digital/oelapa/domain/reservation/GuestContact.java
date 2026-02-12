package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents guest contact information including email and phone.
 * Provides validation for common contact formats.
 */
@Data
public class GuestContact {

    /**
     * Guest's email address.
     */
    @Email(message = "Email must be a valid email address")
    @Size(max = 255)
    private String email;

    /**
     * Guest's phone number (international format recommended).
     */
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be in valid international format")
    @Size(max = 20)
    private String phone;

    /**
     * Alternative phone number (e.g., mobile if primary is landline).
     */
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Alternative phone number must be in valid international format")
    @Size(max = 20)
    private String alternativePhone;

    /**
     * Fax number (if applicable).
     */
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Fax number must be in valid international format")
    @Size(max = 20)
    private String fax;
}