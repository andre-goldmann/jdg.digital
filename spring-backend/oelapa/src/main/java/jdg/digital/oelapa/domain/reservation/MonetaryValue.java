package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Represents a monetary value with currency information.
 * Used throughout the reservation system for amounts, fees, and financial calculations.
 */
@Data
public class MonetaryValue {

    /**
     * The monetary amount with appropriate precision for financial calculations.
     */
    @NotNull
    @Positive
    private BigDecimal amount;

    /**
     * The ISO 4217 currency code (e.g., "EUR", "USD", "GBP").
     */
    @NotNull
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter ISO 4217 code")
    private String currency;
}