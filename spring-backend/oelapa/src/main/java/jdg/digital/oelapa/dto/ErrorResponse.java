package jdg.digital.oelapa.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard error response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

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
}