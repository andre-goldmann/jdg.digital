package jdg.digital.oelapa.domain.reservation;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a complete reservation with all associated information.
 * Central domain object for reservation management based on Apaleo API specification.
 * JPA Entity mapped to the 'reservations' table.
 */
@Entity
@Table(name = "reservations", indexes = {
    @Index(name = "idx_reservation_status", columnList = "status"),
    @Index(name = "idx_reservation_booking_id", columnList = "booking_id"),
    @Index(name = "idx_reservation_property_id", columnList = "property_id"),
    @Index(name = "idx_reservation_arrival", columnList = "arrival"),
    @Index(name = "idx_reservation_departure", columnList = "departure")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    /**
     * Reservation unique identifier (database generated).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Booking identifier that groups related reservations.
     */
    @Column(name = "booking_id", nullable = false, length = 50)
    @NotBlank
    @Size(max = 50)
    private String bookingId;

    /**
     * Block identifier (for group bookings).
     */
    @Column(name = "block_id", length = 50)
    @Size(max = 50)
    private String blockId;

    /**
     * Group name (for group bookings).
     */
    @Column(name = "group_name", length = 100)
    @Size(max = 100)
    private String groupName;

    /**
     * Current status of the reservation.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @NotNull
    private ReservationStatus status;

    /**
     * Check-in timestamp.
     */
    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    /**
     * Check-out timestamp.
     */
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    /**
     * Cancellation timestamp.
     */
    @Column(name = "cancellation_time")
    private LocalDateTime cancellationTime;

    /**
     * No-show timestamp.
     */
    @Column(name = "no_show_time")
    private LocalDateTime noShowTime;

    /**
     * Property ID (simplified for MVP - will be replaced with @ManyToOne later).
     */
    @Column(name = "property_id", length = 50)
    private String propertyId;

    /**
     * Rate plan ID (simplified for MVP - will be replaced with @ManyToOne later).
     */
    @Column(name = "rate_plan_id", length = 50)
    private String ratePlanId;

    /**
     * Unit group ID (simplified for MVP - will be replaced with @ManyToOne later).
     */
    @Column(name = "unit_group_id", length = 50)
    private String unitGroupId;

    /**
     * Unit ID (simplified for MVP - will be replaced with @ManyToOne later).
     */
    @Column(name = "unit_id", length = 50)
    private String unitId;

    /**
     * Total gross amount for the entire reservation (simplified to BigDecimal).
     */
    @Column(name = "total_gross_amount", precision = 19, scale = 2)
    private java.math.BigDecimal totalGrossAmount;

    /**
     * Currency code (ISO 4217).
     */
    @Column(name = "currency", length = 3)
    private String currency;

    /**
     * Arrival date and time.
     */
    @Column(name = "arrival", nullable = false)
    @NotNull
    private LocalDateTime arrival;

    /**
     * Departure date and time.
     */
    @Column(name = "departure", nullable = false)
    @NotNull
    private LocalDateTime departure;

    /**
     * Creation timestamp (auto-populated).
     */
    @Column(name = "created", nullable = false, updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime created;

    /**
     * Last modification timestamp (auto-updated).
     */
    @Column(name = "modified", nullable = false)
    @org.hibernate.annotations.UpdateTimestamp
    private LocalDateTime modified;

    /**
     * Number of adult guests.
     */
    @Column(name = "adults", nullable = false)
    @NotNull
    @Positive
    private Integer adults;

    /**
     * Ages of children guests (stored as comma-separated string for simplicity).
     */
    @Column(name = "children_ages", length = 100)
    private String childrenAges;

    /**
     * Additional comments about the reservation.
     */
    @Column(name = "comment", columnDefinition = "TEXT")
    @Size(max = 1000)
    private String comment;

    /**
     * Guest comments and special requests.
     */
    @Column(name = "guest_comment", columnDefinition = "TEXT")
    @Size(max = 1000)
    private String guestComment;

    /**
     * External system code.
     */
    @Column(name = "external_code", length = 50)
    @Size(max = 50)
    private String externalCode;

    /**
     * Booking channel code.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "channel_code", nullable = false, length = 50)
    @NotNull
    private ChannelCode channelCode;

    /**
     * Primary guest first name (simplified).
     */
    @Column(name = "primary_guest_first_name", length = 100)
    private String primaryGuestFirstName;

    /**
     * Primary guest last name (simplified).
     */
    @Column(name = "primary_guest_last_name", length = 100)
    private String primaryGuestLastName;

    /**
     * Primary guest email (simplified).
     */
    @Column(name = "primary_guest_email", length = 255)
    private String primaryGuestEmail;

    /**
     * Guarantee type for this reservation.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "guarantee_type", nullable = false, length = 50)
    @NotNull
    private GuaranteeType guaranteeType;

    /**
     * Current balance (positive = guest owes, negative = guest credit).
     */
    @Column(name = "balance", precision = 19, scale = 2)
    private java.math.BigDecimal balance;

    /**
     * Company ID (for corporate bookings).
     */
    @Column(name = "company_id", length = 50)
    private String companyId;

    /**
     * Corporate code used for booking.
     */
    @Column(name = "corporate_code", length = 50)
    @Size(max = 50)
    private String corporateCode;

    /**
     * Whether all folios have invoices.
     */
    @Column(name = "all_folios_have_invoice")
    private Boolean allFoliosHaveInvoice;

    /**
     * Whether city tax applies to this reservation.
     */
    @Column(name = "has_city_tax", nullable = false)
    @NotNull
    @Builder.Default
    private Boolean hasCityTax = false;

    /**
     * Whether guest is pre-checked in.
     */
    @Column(name = "is_pre_checked_in", nullable = false)
    @NotNull
    @Builder.Default
    private Boolean isPreCheckedIn = false;

    /**
     * Whether reservation is open for additional charges.
     */
    @Column(name = "is_open_for_charges", nullable = false)
    @NotNull
    @Builder.Default
    private Boolean isOpenForCharges = true;

    /**
     * Travel purpose (Business or Leisure).
     */
    @Column(name = "travel_purpose", length = 20)
    private String travelPurpose;

    /**
     * Promo code used for booking.
     */
    @Column(name = "promo_code", length = 50)
    private String promoCode;

    /**
     * Source of reservation.
     */
    @Column(name = "source", length = 100)
    private String source;

    /**
     * Market segment ID.
     */
    @Column(name = "market_segment_id", length = 50)
    private String marketSegmentId;
}