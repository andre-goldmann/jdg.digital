package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a lightweight rate plan reference without full entity loading.
 * Contains essential rate plan information for reservation context.
 */
@Data
public class EmbeddedRatePlan {

    /**
     * Rate plan unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Rate plan code (usually short identifier).
     */
    @NotBlank
    @Size(max = 20)
    private String code;

    /**
     * Rate plan display name.
     */
    @NotBlank
    @Size(max = 100)
    private String name;

    /**
     * Rate plan description.
     */
    @Size(max = 500)
    private String description;

    /**
     * Whether this rate plan is subject to city tax.
     */
    @NotNull
    private Boolean isSubjectToCityTax;

    /**
     * Rate plan category (Standard, Corporate, Package, etc.).
     */
    @Size(max = 50)
    private String category;

    /**
     * Whether this is a refundable rate plan.
     */
    private Boolean isRefundable;
}