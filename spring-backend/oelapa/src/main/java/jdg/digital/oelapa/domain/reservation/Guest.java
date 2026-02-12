package jdg.digital.oelapa.domain.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Represents a guest with personal information and contact details.
 * Central entity for guest management in reservations.
 */
@Data
public class Guest {

    /**
     * Guest's title (Mr, Ms, Dr, etc.).
     */
    @Size(max = 10)
    private String title;

    /**
     * Guest's gender.
     */
    private Gender gender;

    /**
     * Guest's first name.
     */
    @NotBlank
    @Size(max = 100)
    private String firstName;

    /**
     * Guest's middle initial or name.
     */
    @Size(max = 10)
    private String middleInitial;

    /**
     * Guest's last name/surname.
     */
    @NotBlank
    @Size(max = 100)
    private String lastName;

    /**
     * Guest's contact information.
     */
    @Valid
    private GuestContact contact;

    /**
     * Guest's address information.
     */
    @Valid
    private Address address;

    /**
     * Guest's vehicle registration information.
     */
    @Valid
    private VehicleRegistration vehicleRegistration;

    /**
     * Date of birth in ISO 8601 format (YYYY-MM-DD).
     */
    private String dateOfBirth;

    /**
     * Nationality (ISO 3166-1 alpha-2 country code).
     */
    @Size(max = 2)
    private String nationality;

    /**
     * Additional notes or comments about the guest.
     */
    @Size(max = 1000)
    private String notes;

    /**
     * Gender enumeration for guest information.
     */
    public enum Gender {
        MALE("Male"),
        FEMALE("Female"),
        OTHER("Other"),
        PREFER_NOT_TO_SAY("PreferNotToSay");

        private final String value;

        Gender(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}