package jdg.digital.oelapa.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ReservationController - Apaleo API compliant
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ReservationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getReservations_ShouldReturnApaleoCompliantStructure() throws Exception {
        // Test GET all returns ReservationListModel structure
        mockMvc.perform(get("/booking/v1/reservations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.reservations").isArray())
                .andExpect(jsonPath("$.reservations").isEmpty())
                .andExpect(jsonPath("$.count").value(0))
                .andExpect(jsonPath("$.count").isNumber());
    }

    @Test
    void getReservations_ResponseStructureValidation() throws Exception {
        mockMvc.perform(get("/booking/v1/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations").exists())
                .andExpect(jsonPath("$.count").exists())
                // Ensure no other fields are present at root level
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getReservations_FullApplicationContext() throws Exception {
        // Integration test with full application context
        mockMvc.perform(get("/booking/v1/reservations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.reservations").isArray())
                .andExpect(jsonPath("$.count").value(0));
    }

    @Test
    void getReservationsCount_ShouldReturnCountModel() throws Exception {
        // Test GET count returns CountModel structure
        mockMvc.perform(get("/booking/v1/reservations/$count"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.count").value(0))
                .andExpect(jsonPath("$.count").isNumber())
                // Ensure only count field is present
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getReservationById_ShouldReturnReservationModel() throws Exception {
        // Test GET by ID returns ReservationModel structure
        String reservationId = "RES-123456";
        
        mockMvc.perform(get("/booking/v1/reservations/{id}", reservationId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(reservationId))
                .andExpect(jsonPath("$.status").value("Confirmed"));
    }

    @Test
    void getReservationById_WithExpandParameter_ShouldReturnReservationModel() throws Exception {
        // Test GET by ID with expand parameter
        String reservationId = "RES-123456";
        
        mockMvc.perform(get("/booking/v1/reservations/{id}", reservationId)
                .param("expand", "timeSlices", "services"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(reservationId))
                .andExpect(jsonPath("$.status").value("Confirmed"));
    }

    @Test
    void updateReservation_ShouldReturnNoContent() throws Exception {
        // Test PATCH returns 204 No Content
        String reservationId = "RES-123456";
        String patchOperations = """
            [
                {
                    "op": "replace",
                    "path": "/comment",
                    "value": "Updated comment"
                },
                {
                    "op": "add",
                    "path": "/guestComment",
                    "value": "Special request"
                }
            ]
            """;
        
        mockMvc.perform(patch("/booking/v1/reservations/{id}", reservationId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(patchOperations))
                .andExpect(status().isNoContent());
    }

    @Test
    void updateReservation_EmptyOperations_ShouldReturnNoContent() throws Exception {
        // Test PATCH with empty operations array
        String reservationId = "RES-123456";
        String emptyOperations = "[]";
        
        mockMvc.perform(patch("/booking/v1/reservations/{id}", reservationId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyOperations))
                .andExpect(status().isNoContent());
    }
}