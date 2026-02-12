package jdg.digital.oelapa.domain.reservation;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enumeration for reservation status values based on Apaleo API specification.
 * Represents the current state of a reservation in its lifecycle.
 */
public enum ReservationStatus {
    
    /**
     * Reservation is confirmed and awaiting arrival.
     */
    CONFIRMED("Confirmed"),
    
    /**
     * Guest has checked in and is currently staying.
     */
    IN_HOUSE("InHouse"),
    
    /**
     * Guest has checked out and the reservation is complete.
     */
    CHECKED_OUT("CheckedOut"),
    
    /**
     * Reservation has been cancelled.
     */
    CANCELED("Canceled"),
    
    /**
     * Guest did not show up for the reservation.
     */
    NO_SHOW("NoShow");

    private final String value;

    ReservationStatus(String value) {
        this.value = value;
    }

    /**
     * Gets the string value used in API communication.
     * 
     * @return the API string value
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Converts from API string value to enum.
     * 
     * @param value the API string value
     * @return the corresponding enum value
     * @throws IllegalArgumentException if the value is not recognized
     */
    public static ReservationStatus fromValue(String value) {
        for (ReservationStatus status : ReservationStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown reservation status: " + value);
    }
}