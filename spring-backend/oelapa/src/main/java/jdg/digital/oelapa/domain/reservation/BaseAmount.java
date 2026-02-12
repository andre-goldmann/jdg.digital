package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Represents pricing breakdown with VAT details for reservation time slices.
 * Contains detailed financial information including tax calculations.
 */
@Data
public class BaseAmount {

    /**
     * Gross amount (including VAT).
     */
    @NotNull
    @Positive
    private BigDecimal grossAmount;

    /**
     * Net amount (excluding VAT).
     */
    @NotNull
    @Positive
    private BigDecimal netAmount;

    /**
     * VAT type classification.
     */
    @NotBlank
    @Size(max = 20)
    private String vatType;

    /**
     * VAT percentage rate.
     */
    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal vatPercent;

    /**
     * ISO 4217 currency code.
     */
    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    /**
     * VAT amount (calculated: grossAmount - netAmount).
     */
    public BigDecimal getVatAmount() {
        if (grossAmount != null && netAmount != null) {
            return grossAmount.subtract(netAmount);
        }
        return BigDecimal.ZERO;
    }
}