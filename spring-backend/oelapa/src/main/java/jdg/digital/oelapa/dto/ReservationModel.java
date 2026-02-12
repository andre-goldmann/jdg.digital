package jdg.digital.oelapa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jdg.digital.oelapa.domain.reservation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response model for individual reservation details.
 * Used by the GET /booking/v1/reservations/{id} endpoint.
 * Based on Apaleo API specification for reservation response structure.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Individual reservation details")
public class ReservationModel {
    
    @JsonProperty("id")
    @Schema(description = "Unique reservation identifier", required = true, example = "RES-123456")
    private String id;
    
    @JsonProperty("bookingId")
    @Schema(description = "Booking identifier that groups related reservations", example = "BOOK-789")
    private String bookingId;
    
    @JsonProperty("status")
    @Schema(description = "Current reservation status", required = true)
    private ReservationStatus status;
    
    @JsonProperty("arrival")
    @Schema(description = "Arrival date and time", example = "2024-01-15T15:00:00")
    private LocalDateTime arrival;
    
    @JsonProperty("departure")
    @Schema(description = "Departure date and time", example = "2024-01-18T11:00:00")
    private LocalDateTime departure;
    
    @JsonProperty("primaryGuest")
    @Schema(description = "Primary guest information")
    private Guest primaryGuest;
    
    @JsonProperty("totalGrossAmount")
    @Schema(description = "Total gross amount for the reservation")
    private MonetaryValue totalGrossAmount;
    
    @JsonProperty("comment")
    @Schema(description = "Internal comment for the reservation")
    private String comment;
    
    @JsonProperty("guestComment")
    @Schema(description = "Guest comment or special requests")
    private String guestComment;
    
    @JsonProperty("paymentAccount")
    @Schema(description = "Payment account information")
    private PaymentAccount paymentAccount;
    
    @JsonProperty("travelPurpose")
    @Schema(description = "Purpose of travel")
    private String travelPurpose;
    
    @JsonProperty("additionalGuests")
    @Schema(description = "Additional guests for the reservation")
    private List<Guest> additionalGuests;
    
    @JsonProperty("commission")
    @Schema(description = "Commission information")
    private MonetaryValue commission;
    
    @JsonProperty("marketSegment")
    @Schema(description = "Market segment information")
    private String marketSegment;
    
    @JsonProperty("isOpenForCharges")
    @Schema(description = "Whether the reservation is open for additional charges")
    private Boolean isOpenForCharges;
    
    @JsonProperty("isPreCheckedIn")
    @Schema(description = "Whether the guest has completed pre-check-in")
    private Boolean isPreCheckedIn;
    
    // Expandable resources - only populated when requested via expand parameter
    @JsonProperty("timeSlices")
    @Schema(description = "Time slices for the reservation (expandable with 'timeSlices')")
    private List<TimeSlice> timeSlices;
    
    @JsonProperty("services") 
    @Schema(description = "Services associated with the reservation (expandable with 'services')")
    private List<Object> services; // Using Object for now as ServiceModel not defined
    
    @JsonProperty("booker")
    @Schema(description = "Booker information (expandable with 'booker')")
    private Object booker; // Using Object for now as BookerModel not defined
    
    @JsonProperty("actions")
    @Schema(description = "Available actions for the reservation (expandable with 'actions')")
    private List<Object> actions; // Using Object for now as ActionModel not defined
    
    @JsonProperty("company")
    @Schema(description = "Company information (expandable with 'company')")
    private Object company; // Using Object for now as CompanyModel not defined
    
    @JsonProperty("assignedUnits")
    @Schema(description = "Assigned units for the reservation (expandable with 'assignedUnits')")
    private List<Object> assignedUnits; // Using Object for now as AssignedUnitModel not defined
}