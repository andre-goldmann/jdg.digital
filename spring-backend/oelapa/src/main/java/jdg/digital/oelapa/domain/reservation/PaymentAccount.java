package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents payment account information for reservations.
 * Contains masked/tokenized payment data for security.
 */
@Data
public class PaymentAccount {

    /**
     * Masked account number (e.g., "**** **** **** 1234").
     */
    @NotBlank
    @Size(max = 50)
    private String accountNumber;

    /**
     * Account holder's name.
     */
    @NotBlank
    @Size(max = 100)
    private String accountHolder;

    /**
     * Expiry month (1-12).
     */
    @Pattern(regexp = "^(0?[1-9]|1[0-2])$", message = "Expiry month must be between 1 and 12")
    private String expiryMonth;

    /**
     * Expiry year (YYYY format).
     */
    @Pattern(regexp = "^\\d{4}$", message = "Expiry year must be in YYYY format")
    private String expiryYear;

    /**
     * Payment method identifier (visa, mastercard, amex, etc.).
     */
    @NotBlank
    @Size(max = 50)
    private String paymentMethod;

    /**
     * Payer's email address.
     */
    @Email
    @Size(max = 255)
    private String payerEmail;

    /**
     * Whether this is a virtual payment account.
     */
    private Boolean isVirtual;

    /**
     * Whether this payment account is currently active.
     */
    private Boolean isActive;

    /**
     * Additional notes about the payment account.
     */
    @Size(max = 500)
    private String note;
}