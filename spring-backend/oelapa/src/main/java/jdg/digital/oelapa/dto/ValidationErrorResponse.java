package jdg.digital.oelapa.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Validation error response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {

    @JsonProperty("error")
    private String error;

    @JsonProperty("message")
    private String message;

    @JsonProperty("status")
    private Integer status;

    @JsonProperty("path")
    private String path;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @JsonProperty("validationErrors")
    private List<FieldError> validationErrors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldError {
        @JsonProperty("field")
        private String field;

        @JsonProperty("message")
        private String message;

        @JsonProperty("rejectedValue")
        private Object rejectedValue;
    }
}