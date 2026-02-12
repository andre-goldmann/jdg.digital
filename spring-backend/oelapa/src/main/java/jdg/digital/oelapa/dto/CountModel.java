package jdg.digital.oelapa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for count of items matching filter criteria.
 * Used by the GET /booking/v1/reservations/$count endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Count of items matching filter criteria")
public class CountModel {
    
    @JsonProperty("count")
    @Schema(description = "Number of items that match the filter criteria", required = true, example = "42")
    private Long count;
}