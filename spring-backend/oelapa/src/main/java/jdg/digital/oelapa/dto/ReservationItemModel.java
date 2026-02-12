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
 * Individual reservation item model matching the Apaleo API specification.
 * Contains all required and optional fields as defined in the Apaleo Booking API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Individual reservation item matching Apaleo API specification")
public class ReservationItemModel {

    @JsonProperty("id")
    @Schema(description = "Reservation id", example = "XPGMSXGF-1", required = true)
    private String id;

    @JsonProperty("bookingId")
    @Schema(description = "Booking id", example = "XPGMSXGF", required = true)
    private String bookingId;

    @JsonProperty("blockId")
    @Schema(description = "Block id")
    private String blockId;

    @JsonProperty("groupName")
    @Schema(description = "Name of the group")
    private String groupName;

    @JsonProperty("status")
    @Schema(description = "Status of the reservation", required = true, 
            allowableValues = {"Confirmed", "InHouse", "CheckedOut", "Canceled", "NoShow"})
    private ReservationStatus status;

    @JsonProperty("checkInTime")
    @Schema(description = "Time of check-in")
    private LocalDateTime checkInTime;

    @JsonProperty("checkOutTime")
    @Schema(description = "Time of check-out")
    private LocalDateTime checkOutTime;

    @JsonProperty("cancellationTime")
    @Schema(description = "Time of cancellation, if the reservation was canceled")
    private LocalDateTime cancellationTime;

    @JsonProperty("noShowTime")
    @Schema(description = "Time of setting no-show reservation status")
    private LocalDateTime noShowTime;

    @JsonProperty("property")
    @Schema(description = "Property information", required = true)
    private EmbeddedProperty property;

    @JsonProperty("ratePlan")
    @Schema(description = "Rate plan information", required = true)
    private EmbeddedRatePlan ratePlan;

    @JsonProperty("unitGroup")
    @Schema(description = "Unit group information", required = true)
    private EmbeddedUnitGroup unitGroup;

    @JsonProperty("unit")
    @Schema(description = "Specific unit assigned to this reservation")
    private EmbeddedUnit unit;

    @JsonProperty("marketSegment")
    @Schema(description = "Market segment information")
    private Object marketSegment; // EmbeddedMarketSegmentModel - TODO: Create if needed

    @JsonProperty("totalGrossAmount")
    @Schema(description = "Total gross amount for the reservation", required = true)
    private MonetaryValue totalGrossAmount;

    @JsonProperty("arrival")
    @Schema(description = "Date of arrival", required = true)
    private LocalDateTime arrival;

    @JsonProperty("departure")
    @Schema(description = "Date of departure", required = true)
    private LocalDateTime departure;

    @JsonProperty("created")
    @Schema(description = "Date of creation", required = true)
    private LocalDateTime created;

    @JsonProperty("modified")
    @Schema(description = "Date of last modification", required = true)
    private LocalDateTime modified;

    @JsonProperty("adults")
    @Schema(description = "Number of adults", required = true)
    private Integer adults;

    @JsonProperty("childrenAges")
    @Schema(description = "The ages of the children")
    private List<Integer> childrenAges;

    @JsonProperty("comment")
    @Schema(description = "Additional information and comments")
    private String comment;

    @JsonProperty("guestComment")
    @Schema(description = "Additional information and comment by the guest")
    private String guestComment;

    @JsonProperty("externalCode")
    @Schema(description = "Code in external system")
    private String externalCode;

    @JsonProperty("channelCode")
    @Schema(description = "Channel code", required = true,
            allowableValues = {"Direct", "BookingCom", "Ibe", "ChannelManager", "Expedia", "Homelike", "Hrs", "AltoVita", "DesVu"})
    private ChannelCode channelCode;

    @JsonProperty("source")
    @Schema(description = "Source of the reservation (e.g Hotels.com, Orbitz, etc.)")
    private String source;

    @JsonProperty("primaryGuest")
    @Schema(description = "Primary guest information")
    private Guest primaryGuest;

    @JsonProperty("additionalGuests")
    @Schema(description = "Additional guests of the reservation")
    private List<Guest> additionalGuests;

    @JsonProperty("booker")
    @Schema(description = "Booker information")
    private Object booker; // BookerModel - TODO: Create if needed

    @JsonProperty("paymentAccount")
    @Schema(description = "Payment account information")
    private PaymentAccount paymentAccount;

    @JsonProperty("registeredCard")
    @Schema(description = "Registered card information")
    private Object registeredCard; // RegisteredCardModel - TODO: Create if needed

    @JsonProperty("guaranteeType")
    @Schema(description = "The strongest guarantee for the rate plans booked in this reservation", required = true,
            allowableValues = {"PM6Hold", "CreditCard", "Prepayment", "Company", "Ota"})
    private GuaranteeType guaranteeType;

    @JsonProperty("cancellationFee")
    @Schema(description = "Cancellation fee information", required = true)
    private CancellationFee cancellationFee;

    @JsonProperty("noShowFee")
    @Schema(description = "No-show fee information", required = true)
    private NoShowFee noShowFee;

    @JsonProperty("travelPurpose")
    @Schema(description = "The purpose of the trip, leisure or business",
            allowableValues = {"Business", "Leisure"})
    private String travelPurpose;

    @JsonProperty("balance")
    @Schema(description = "Current balance", required = true)
    private MonetaryValue balance;

    @JsonProperty("assignedUnits")
    @Schema(description = "The list of units assigned to this reservation")
    private List<Object> assignedUnits; // ReservationAssignedUnitModel - TODO: Create if needed

    @JsonProperty("timeSlices")
    @Schema(description = "The list of time slices with the reserved units / unit groups for the stay")
    private List<TimeSlice> timeSlices;

    @JsonProperty("services")
    @Schema(description = "The list of additional services (extras, add-ons) reserved for the stay")
    private List<Object> services; // ReservationServiceItemModel - TODO: Create if needed

    @JsonProperty("validationMessages")
    @Schema(description = "Validation rules applied to reservations during their lifetime")
    private List<Object> validationMessages; // ReservationValidationMessageModel - TODO: Create if needed

    @JsonProperty("actions")
    @Schema(description = "The list of actions for this reservation")
    private List<Object> actions; // ActionModel - TODO: Create if needed

    @JsonProperty("company")
    @Schema(description = "Company information")
    private EmbeddedCompany company;

    @JsonProperty("corporateCode")
    @Schema(description = "Corporate code provided during creation. Used to find offers during amend.")
    private String corporateCode;

    @JsonProperty("allFoliosHaveInvoice")
    @Schema(description = "Whether all folios of a reservation have an invoice")
    private Boolean allFoliosHaveInvoice;

    @JsonProperty("hasCityTax")
    @Schema(description = "Whether the city tax has already been added to the reservation", required = true)
    private Boolean hasCityTax;

    @JsonProperty("commission")
    @Schema(description = "Commission information")
    private Commission commission;

    @JsonProperty("promoCode")
    @Schema(description = "The promo code associated with a certain special offer used to create the reservation")
    private String promoCode;

    @JsonProperty("isPreCheckedIn")
    @Schema(description = "Indicates whether the reservation is marked as pre-checked-in or not.")
    private Boolean isPreCheckedIn;

    @JsonProperty("isOpenForCharges")
    @Schema(description = "Whether the reservation can accept charges on its folios", required = true)
    private Boolean isOpenForCharges;

    @JsonProperty("externalReferences")
    @Schema(description = "External reference information")
    private ExternalReferences externalReferences;
}