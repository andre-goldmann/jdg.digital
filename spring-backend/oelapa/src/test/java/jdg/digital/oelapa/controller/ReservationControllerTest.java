package jdg.digital.oelapa.controller;

import jdg.digital.oelapa.domain.reservation.ChannelCode;
import jdg.digital.oelapa.domain.reservation.ReservationStatus;
import jdg.digital.oelapa.dto.ReservationItemModel;
import jdg.digital.oelapa.dto.ReservationListModel;
import jdg.digital.oelapa.service.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TDD Test for ReservationController.
 * Tests the REST API layer for GET /booking/v1/reservations endpoint.
 */
@WebMvcTest(ReservationController.class)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservationService reservationService;

    private ReservationListModel mockResponse;
    private ReservationItemModel mockItem1;
    private ReservationItemModel mockItem2;

    @BeforeEach
    void setUp() {
        mockItem1 = new ReservationItemModel();
        mockItem1.setId("1");
        mockItem1.setBookingId("BOOKING001");
        mockItem1.setStatus(ReservationStatus.CONFIRMED);
        mockItem1.setArrival(LocalDateTime.now().plusDays(1));
        mockItem1.setDeparture(LocalDateTime.now().plusDays(3));

        mockItem2 = new ReservationItemModel();
        mockItem2.setId("2");
        mockItem2.setBookingId("BOOKING002");
        mockItem2.setStatus(ReservationStatus.IN_HOUSE);
        mockItem2.setArrival(LocalDateTime.now().minusDays(1));
        mockItem2.setDeparture(LocalDateTime.now().plusDays(1));

        mockResponse = new ReservationListModel();
        mockResponse.setReservations(Arrays.asList(mockItem1, mockItem2));
        mockResponse.setCount(2L);
    }

    @Test
    void shouldReturn200OK_whenGetAllReservations() throws Exception {
        // GIVEN: Service returns reservations
        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(mockResponse);

        // WHEN & THEN: GET request returns 200 OK
        mockMvc.perform(get("/booking/v1/reservations")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void shouldReturnReservationList_withCorrectStructure() throws Exception {
        // GIVEN: Service returns reservations
        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(mockResponse);

        // WHEN & THEN: Response has correct structure
        mockMvc.perform(get("/booking/v1/reservations")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations", hasSize(2)))
                .andExpect(jsonPath("$.count", is(2)))
                .andExpect(jsonPath("$.reservations[0].id", is("1")))
                .andExpect(jsonPath("$.reservations[0].bookingId", is("BOOKING001")))
                .andExpect(jsonPath("$.reservations[0].status", is("Confirmed")))
                .andExpect(jsonPath("$.reservations[1].id", is("2")))
                .andExpect(jsonPath("$.reservations[1].bookingId", is("BOOKING002")))
                .andExpect(jsonPath("$.reservations[1].status", is("InHouse")));
    }

    @Test
    void shouldFilterByStatus_whenStatusParameterProvided() throws Exception {
        // GIVEN: Service returns filtered reservations
        ReservationListModel filteredResponse = new ReservationListModel();
        filteredResponse.setReservations(Collections.singletonList(mockItem1));
        filteredResponse.setCount(1L);

        when(reservationService.getAllReservations(
                eq(Collections.singletonList(ReservationStatus.CONFIRMED)), 
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(filteredResponse);

        // WHEN & THEN: Request with status filter
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("status", "Confirmed")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations", hasSize(1)))
                .andExpect(jsonPath("$.reservations[0].status", is("Confirmed")));

        verify(reservationService).getAllReservations(
                eq(Collections.singletonList(ReservationStatus.CONFIRMED)),
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt());
    }

    @Test
    void shouldFilterByBookingId_whenBookingIdParameterProvided() throws Exception {
        // GIVEN: Service returns reservation with specific booking ID
        ReservationListModel filteredResponse = new ReservationListModel();
        filteredResponse.setReservations(Collections.singletonList(mockItem1));
        filteredResponse.setCount(1L);

        when(reservationService.getAllReservations(
                any(), eq("BOOKING001"), any(), any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(filteredResponse);

        // WHEN & THEN: Request with booking ID filter
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("bookingId", "BOOKING001")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations", hasSize(1)))
                .andExpect(jsonPath("$.reservations[0].bookingId", is("BOOKING001")));

        verify(reservationService).getAllReservations(
                any(), eq("BOOKING001"), any(), any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt());
    }

    @Test
    void shouldFilterByPropertyIds_whenMultiplePropertyIdsProvided() throws Exception {
        // GIVEN: Service returns reservations for specific properties
        when(reservationService.getAllReservations(
                any(), any(), eq(Arrays.asList("PROP001", "PROP002")), 
                any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(mockResponse);

        // WHEN & THEN: Request with multiple property IDs
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("propertyIds", "PROP001", "PROP002")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations", hasSize(2)));

        verify(reservationService).getAllReservations(
                any(), any(), eq(Arrays.asList("PROP001", "PROP002")), 
                any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt());
    }

    @Test
    void shouldFilterByDateRange_whenFromAndToProvided() throws Exception {
        // GIVEN: Service returns reservations in date range
        when(reservationService.getAllReservations(
                any(), any(), any(), notNull(), notNull(), eq("Arrival"), 
                any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(mockResponse);

        // WHEN & THEN: Request with date range
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("from", "2025-01-01")
                        .param("to", "2025-12-31")
                        .param("dateFilter", "Arrival")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations", hasSize(2)));

        verify(reservationService).getAllReservations(
                any(), any(), any(), notNull(), notNull(), eq("Arrival"), 
                any(), any(), any(), any(), any(), anyInt(), anyInt());
    }

    @Test
    void shouldFilterByChannelCode_whenChannelCodesProvided() throws Exception {
        // GIVEN: Service returns reservations for specific channel
        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), 
                eq(Collections.singletonList(ChannelCode.DIRECT)), 
                any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(mockResponse);

        // WHEN & THEN: Request with channel code filter
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("channelCodes", "Direct")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(reservationService).getAllReservations(
                any(), any(), any(), any(), any(), any(), 
                eq(Collections.singletonList(ChannelCode.DIRECT)), 
                any(), any(), any(), any(), anyInt(), anyInt());
    }

    @Test
    void shouldSearchByText_whenTextSearchProvided() throws Exception {
        // GIVEN: Service returns matching reservations
        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), 
                eq("John Doe"), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(mockResponse);

        // WHEN & THEN: Request with text search
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("textSearch", "John Doe")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(reservationService).getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), 
                eq("John Doe"), any(), any(), any(), anyInt(), anyInt());
    }

    @Test
    void shouldApplyPagination_whenPageParametersProvided() throws Exception {
        // GIVEN: Service returns paginated results
        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), 
                any(), any(), any(), eq(2), eq(10)))
                .thenReturn(mockResponse);

        // WHEN & THEN: Request with pagination parameters
        mockMvc.perform(get("/booking/v1/reservations")
                        .param("pageNumber", "2")
                        .param("pageSize", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(reservationService).getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), 
                any(), any(), any(), eq(2), eq(10));
    }

    @Test
    void shouldUseDefaultPagination_whenNoPageParametersProvided() throws Exception {
        // GIVEN: Service is called with defaults
        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), 
                any(), any(), any(), eq(0), eq(100)))
                .thenReturn(mockResponse);

        // WHEN & THEN: Request without pagination parameters
        mockMvc.perform(get("/booking/v1/reservations")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(reservationService).getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), 
                any(), any(), any(), eq(0), eq(100));
    }

    @Test
    void shouldReturnEmptyList_whenNoReservationsMatch() throws Exception {
        // GIVEN: Service returns empty result
        ReservationListModel emptyResponse = new ReservationListModel();
        emptyResponse.setReservations(Collections.emptyList());
        emptyResponse.setCount(0L);

        when(reservationService.getAllReservations(
                any(), any(), any(), any(), any(), any(), any(), any(), 
                any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(emptyResponse);

        // WHEN & THEN: Request returns empty list with 200 OK
        mockMvc.perform(get("/booking/v1/reservations")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations", hasSize(0)))
                .andExpect(jsonPath("$.count", is(0)));
    }
}