package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents no-show fee information for a reservation.
 * Defines the fee policy and amounts applicable when guest doesn't show up.
 */
@Data
public class NoShowFee {

    /**
     * No-show policy ID.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * No-show policy code.
     */
    @NotBlank
    @Size(max = 50)
    private String code;

    /**
     * No-show policy name.
     */
    @NotBlank
    @Size(max = 100)
    private String name;

    /**
     * Detailed description of the no-show policy.
     */
    @Size(max = 500)
    private String description;

    /**
     * The no-show fee amount.
     */
    @Valid
    @NotNull
    private MonetaryValue fee;
}