package jdg.digital.oelapa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a JSON Patch operation for modifying reservation properties.  
 * Based on RFC 6902 JSON Patch specification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "JSON Patch operation for modifying reservation properties")
public class Operation {
    
    @JsonProperty("op")
    @Schema(description = "The operation to perform", required = true, 
            allowableValues = {"add", "remove", "replace", "move", "copy", "test"},
            example = "replace")
    private String op;
    
    @JsonProperty("path")
    @Schema(description = "JSON Pointer path to the property to modify", required = true, 
            example = "/comment")
    private String path;
    
    @JsonProperty("value")
    @Schema(description = "The value to use for the operation (not required for remove operations)",
            example = "Updated comment")
    private Object value;
    
    @JsonProperty("from")
    @Schema(description = "JSON Pointer path for move and copy operations",
            example = "/oldComment")
    private String from;
}