package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a lightweight company reference without full entity loading.
 * Contains corporate client information for business reservations.
 */
@Data
public class EmbeddedCompany {

    /**
     * Company unique identifier.
     */
    @NotBlank
    @Size(max = 50)
    private String id;

    /**
     * Company code (usually short identifier).
     */
    @NotBlank
    @Size(max = 20)
    private String code;

    /**
     * Company name.
     */
    @NotBlank
    @Size(max = 200)
    private String name;

    /**
     * Company description or type.
     */
    @Size(max = 500)
    private String description;

    /**
     * Whether this company can check out on account receivables.
     */
    private Boolean canCheckOutOnAr;

    /**
     * Company tax identification number.
     */
    @Size(max = 50)
    private String taxId;

    /**
     * Company billing address (brief).
     */
    @Size(max = 200)
    private String billingAddress;

    /**
     * Primary contact person at the company.
     */
    @Size(max = 100)
    private String contactPerson;

    /**
     * Company contact email.
     */
    @Size(max = 255)
    private String contactEmail;
}