package jdg.digital.oelapa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jdg.digital.oelapa.domain.reservation.ChannelCode;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import jdg.digital.oelapa.dto.CountModel;
import jdg.digital.oelapa.dto.ReservationListModel;
import jdg.digital.oelapa.dto.ReservationModel;
import jdg.digital.oelapa.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for reservation operations - Apaleo API compliant
 * This controller implements the Apaleo booking API specification for reservations.
 */
@RestController
@RequestMapping("/booking/v1/reservations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reservations", description = "Reservation management API compatible with Apaleo specification")
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Get all reservations according to Apaleo API specification
     * @return ReservationListModel containing list of reservations and total count
     */
    @GetMapping
    @Operation(summary = "Get all reservations", 
               description = "Retrieve a list of all reservations matching the Apaleo API specification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved reservations",
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = ReservationListModel.class)))
    })
    public ResponseEntity<ReservationListModel> getAllReservations(
            @Parameter(description = "Filter by reservation status (e.g., Confirmed, InHouse, CheckedOut)")
            @RequestParam(required = false) List<String> status,
            
            @Parameter(description = "Filter by booking ID")
            @RequestParam(required = false) String bookingId,
            
            @Parameter(description = "Filter by property IDs")
            @RequestParam(required = false) List<String> propertyIds,
            
            @Parameter(description = "Start date for date range filter (ISO 8601 format: YYYY-MM-DD)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            
            @Parameter(description = "End date for date range filter (ISO 8601 format: YYYY-MM-DD)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            
            @Parameter(description = "Date filter type: Arrival, Departure, Stay, Creation, Modification")
            @RequestParam(required = false) String dateFilter,
            
            @Parameter(description = "Filter by channel codes")
            @RequestParam(required = false) List<String> channelCodes,
            
            @Parameter(description = "Text search across booking ID, guest names, and email")
            @RequestParam(required = false) String textSearch,
            
            @Parameter(description = "Filter by unit group IDs")
            @RequestParam(required = false) List<String> unitGroupIds,
            
            @Parameter(description = "Filter by unit IDs")
            @RequestParam(required = false) List<String> unitIds,
            
            @Parameter(description = "List of resources to expand")
            @RequestParam(required = false) List<String> expand,
            
            @Parameter(description = "Page number for pagination (0-based)")
            @RequestParam(defaultValue = "0") int pageNumber,
            
            @Parameter(description = "Page size for pagination")
            @RequestParam(defaultValue = "100") int pageSize) {
        
        log.info("GET /booking/v1/reservations - Fetching reservations with filters: status={}, bookingId={}, propertyIds={}, from={}, to={}, dateFilter={}, channelCodes={}, textSearch={}, pageNumber={}, pageSize={}",
                status, bookingId, propertyIds, from, to, dateFilter, channelCodes, textSearch, pageNumber, pageSize);
        
        // Convert status strings to enums
        List<ReservationStatus> statusEnums = null;
        if (status != null && !status.isEmpty()) {
            statusEnums = status.stream()
                    .map(s -> ReservationStatus.valueOf(s.toUpperCase().replace(" ", "_")))
                    .collect(Collectors.toList());
        }
        
        // Convert channel code strings to enums
        List<ChannelCode> channelCodeEnums = null;
        if (channelCodes != null && !channelCodes.isEmpty()) {
            channelCodeEnums = channelCodes.stream()
                    .map(c -> ChannelCode.valueOf(c.toUpperCase().replace(" ", "_")))
                    .collect(Collectors.toList());
        }
        
        // Call service layer with all parameters
        ReservationListModel response = reservationService.getAllReservations(
                statusEnums,
                bookingId,
                propertyIds,
                from,
                to,
                dateFilter,
                channelCodeEnums,
                textSearch,
                unitGroupIds,
                unitIds,
                expand,
                pageNumber,
                pageSize
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get count of reservations according to Apaleo API specification
     * @return CountModel containing count of reservations matching filter criteria
     */
    @GetMapping("/$count")
    @Operation(summary = "Count reservations", 
               description = "Returns the number of reservations fulfilling the criteria specified in the parameters")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully counted reservations",
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = CountModel.class))),
        @ApiResponse(responseCode = "400", description = "Bad request"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<CountModel> getReservationsCount() {
        log.info("GET /booking/v1/reservations/$count - Counting reservations");
        
        // Return count of 0 as per requirement (no business logic)
        CountModel response = CountModel.builder()
                .count(0L)
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get specific reservation by ID according to Apaleo API specification
     * @param id Reservation identifier
     * @param expand List of resources to expand
     * @return ReservationModel containing reservation details
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get reservation by ID", 
               description = "Retrieves a reservation, specified by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved reservation",
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = ReservationModel.class))),
        @ApiResponse(responseCode = "404", description = "Reservation not found"),
        @ApiResponse(responseCode = "400", description = "Bad request"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ReservationModel> getReservationById(
            @Parameter(description = "Reservation identifier", required = true)
            @PathVariable String id,
            @Parameter(description = "List of resources to expand", 
                      schema = @Schema(allowableValues = {"timeSlices", "services", "booker", "actions", "company", "assignedUnits"}))
            @RequestParam(required = false) List<String> expand) {
        
        log.info("GET /booking/v1/reservations/{} - Fetching reservation with expand: {}", id, expand);
        
        // Return empty reservation as per requirement (no business logic)
        ReservationModel response = ReservationModel.builder()
                .id(id)
                .status(ReservationStatus.CONFIRMED)
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Modify reservation properties using JSON Patch operations according to Apaleo API specification
     * @param id Reservation identifier
     * @param operations List of JSON Patch operations
     * @return No content response
     */
    @PatchMapping("/{id}")
    @Operation(summary = "Modify reservation properties", 
               description = "Allows to modify certain reservation properties using JSON Patch operations")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Reservation properties updated successfully"),
        @ApiResponse(responseCode = "404", description = "Reservation not found"),
        @ApiResponse(responseCode = "400", description = "Bad request or invalid JSON Patch format"),
        @ApiResponse(responseCode = "422", description = "Unprocessable entity - validation errors"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> updateReservation(
            @Parameter(description = "Reservation identifier", required = true)
            @PathVariable String id,
            @Parameter(description = "List of JSON Patch operations", required = true)
            @RequestBody List<jdg.digital.oelapa.dto.Operation> operations) {
        
        log.info("PATCH /booking/v1/reservations/{} - Updating reservation with {} operations", id, operations.size());
        
        // Log each operation for debugging (no business logic implementation)
        operations.forEach(op -> 
            log.debug("Operation: {} on path {} with value {}", op.getOp(), op.getPath(), op.getValue())
        );
        
        // Return 204 No Content as per requirement (no business logic)
        return ResponseEntity.noContent().build();
    }
}