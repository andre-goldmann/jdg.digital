package jdg.digital.oelapa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Response model for list of reservations matching the Apaleo API specification.
 * This model represents the structure returned by GET /booking/v1/reservations endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "List of reservations with total count")
public class ReservationListModel {

    @NotNull
    @Valid
    @JsonProperty("reservations")
    @Schema(description = "List of reservations", required = true)
    private List<ReservationItemModel> reservations;

    @NotNull
    @Min(0)
    @JsonProperty("count")
    @Schema(description = "Total count of items", required = true, example = "42")
    private Long count;
}