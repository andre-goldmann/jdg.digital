package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Represents commission information for reservations.
 * Tracks commission amounts and pre-commission totals for different booking channels.
 */
@Data
public class Commission {

    /**
     * The commission amount to be paid to the booking channel.
     */
    @Valid
    @NotNull
    private MonetaryValue commissionAmount;

    /**
     * The total amount before commission deduction.
     */
    @Valid
    @NotNull
    private MonetaryValue beforeCommissionAmount;

    /**
     * Commission percentage rate (if applicable).
     */
    private Double commissionRate;

    /**
     * Additional notes about the commission arrangement.
     */
    private String notes;
}