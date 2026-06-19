package com.bookclass.ms_attendance.controller;

import com.bookclass.ms_attendance.dto.request.AttendanceRequest;
import com.bookclass.ms_attendance.dto.response.AttendanceResponse;
import com.bookclass.ms_attendance.dto.response.AttendanceSummaryResponse;
import com.bookclass.ms_attendance.model.entity.AttendanceStatus;
import com.bookclass.ms_attendance.service.AttendanceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class AttendanceControllerTest {

    @Mock
    private AttendanceService attendanceService;

    @InjectMocks
    private AttendanceController attendanceController;

    private AttendanceResponse attendanceResponse;
    private AttendanceRequest attendanceRequest;
    private AttendanceSummaryResponse summaryResponse;

    @BeforeEach
    void setUp() {
        attendanceResponse = AttendanceResponse.builder()
                .id(1L)
                .studentId(1L)
                .fecha(LocalDate.of(2026, 6, 19))
                .status(AttendanceStatus.PRESENTE)
                .observacion("Asistió")
                .registeredBy(10L)
                .build();

        attendanceRequest = AttendanceRequest.builder()
                .studentId(1L)
                .fecha(LocalDate.of(2026, 6, 19))
                .status(AttendanceStatus.PRESENTE)
                .observacion("Asistió")
                .registeredBy(10L)
                .build();

        summaryResponse = AttendanceSummaryResponse.builder()
                .studentId(1L)
                .totalDays(100L)
                .presentDays(90L)
                .absentDays(5L)
                .lateDays(3L)
                .justifiedDays(2L)
                .attendancePercentage(new BigDecimal("95.00"))
                .status("OK")
                .build();
    }

    @Test
    void recordAttendance_shouldReturn201() {
        when(attendanceService.recordAttendance(any(AttendanceRequest.class))).thenReturn(attendanceResponse);

        ResponseEntity<AttendanceResponse> response = attendanceController.recordAttendance(attendanceRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getStudentId());
    }

    @Test
    void updateAttendance_shouldReturn200() {
        when(attendanceService.updateAttendance(eq(1L), any(AttendanceRequest.class))).thenReturn(attendanceResponse);

        ResponseEntity<AttendanceResponse> response = attendanceController.updateAttendance(1L, attendanceRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void getAttendanceById_shouldReturn200() {
        when(attendanceService.getAttendanceById(1L)).thenReturn(attendanceResponse);

        ResponseEntity<AttendanceResponse> response = attendanceController.getAttendanceById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void getAttendanceByStudent_shouldReturn200() {
        when(attendanceService.getAttendanceByStudent(1L)).thenReturn(List.of(attendanceResponse));

        ResponseEntity<List<AttendanceResponse>> response = attendanceController.getAttendanceByStudent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAttendanceByStudentAndDateRange_shouldReturn200() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);
        when(attendanceService.getAttendanceByStudentAndDateRange(1L, start, end)).thenReturn(List.of(attendanceResponse));

        ResponseEntity<List<AttendanceResponse>> response = 
                attendanceController.getAttendanceByStudentAndDateRange(1L, start, end);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAttendanceByDate_shouldReturn200() {
        LocalDate date = LocalDate.of(2026, 6, 19);
        when(attendanceService.getAttendanceByDate(date)).thenReturn(List.of(attendanceResponse));

        ResponseEntity<List<AttendanceResponse>> response = attendanceController.getAttendanceByDate(date);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAttendanceSummary_shouldReturn200() {
        when(attendanceService.getAttendanceSummary(1L)).thenReturn(summaryResponse);

        ResponseEntity<AttendanceSummaryResponse> response = attendanceController.getAttendanceSummary(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(new BigDecimal("95.00"), response.getBody().getAttendancePercentage());
    }

    @Test
    void getAttendanceSummaryByDateRange_shouldReturn200() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);
        when(attendanceService.getAttendanceSummaryByDateRange(1L, start, end)).thenReturn(summaryResponse);

        ResponseEntity<AttendanceSummaryResponse> response = 
                attendanceController.getAttendanceSummaryByDateRange(1L, start, end);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(100L, response.getBody().getTotalDays());
    }

    @Test
    void deleteAttendance_shouldReturn204() {
        doNothing().when(attendanceService).deleteAttendance(1L);

        ResponseEntity<Void> response = attendanceController.deleteAttendance(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(attendanceService, times(1)).deleteAttendance(1L);
    }
}
