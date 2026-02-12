package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Represents cancellation fee information for a reservation.
 * Defines the fee policy and amounts applicable for cancellation.
 */
@Data
public class CancellationFee {

    /**
     * Cancellation policy ID.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Cancellation policy code.
     */
    @NotBlank
    @Size(max = 50)
    private String code;

    /**
     * Cancellation policy name.
     */
    @NotBlank
    @Size(max = 100)
    private String name;

    /**
     * Detailed description of the cancellation policy.
     */
    @Size(max = 500)
    private String description;

    /**
     * Due date and time for the cancellation fee.
     */
    @NotNull
    private LocalDateTime dueDateTime;

    /**
     * The cancellation fee amount.
     */
    @Valid
    @NotNull
    private MonetaryValue fee;
}