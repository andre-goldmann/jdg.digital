package jdg.digital.oelapa.domain.reservation;

/**
 * Enumeration for guarantee types used in reservations.
 * Represents the method used to guarantee the reservation payment.
 */
public enum GuaranteeType {
    
    /**
     * Guaranteed with a credit card.
     */
    CREDIT_CARD("CreditCard"),
    
    /**
     * Guaranteed with a deposit payment.
     */
    DEPOSIT("Deposit"),
    
    /**
     * Guaranteed by company account (corporate bookings).
     */
    COMPANY("Company"),
    
    /**
     * Guaranteed through agent/travel agency.
     */
    AGENT("Agent"),
    
    /**
     * No guarantee required.
     */
    NONE("None"),
    
    /**
     * Other guarantee method not specified above.
     */
    OTHER("Other");

    private final String value;

    GuaranteeType(String value) {
        this.value = value;
    }

    /**
     * Gets the string value used in API communication.
     * 
     * @return the API string value
     */
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
    public static GuaranteeType fromValue(String value) {
        for (GuaranteeType type : GuaranteeType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown guarantee type: " + value);
    }
}