package jdg.digital.oelapa.domain.reservation;

/**
 * Enumeration for booking channel codes based on Apaleo API specification.
 * Represents the source or channel through which the reservation was made.
 */
public enum ChannelCode {
    
    /**
     * Direct booking through hotel's own system.
     */
    DIRECT("Direct"),
    
    /**
     * Booking through Booking.com.
     */
    BOOKING_COM("BookingCom"),
    
    /**
     * Internet Booking Engine - hotel's own website.
     */
    IBE("Ibe"),
    
    /**
     * Channel Manager system.
     */
    CHANNEL_MANAGER("ChannelManager"),
    
    /**
     * Booking through Expedia.
     */
    EXPEDIA("Expedia"),
    
    /**
     * Booking through Homelike platform.
     */
    HOMELIKE("Homelike"),
    
    /**
     * Other booking channels not specified above.
     */
    OTHER("Other");

    private final String value;

    ChannelCode(String value) {
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
    public static ChannelCode fromValue(String value) {
        for (ChannelCode channel : ChannelCode.values()) {
            if (channel.value.equals(value)) {
                return channel;
            }
        }
        throw new IllegalArgumentException("Unknown channel code: " + value);
    }
}