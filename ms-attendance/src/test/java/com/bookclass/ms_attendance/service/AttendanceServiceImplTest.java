package com.bookclass.ms_attendance.service;

import com.bookclass.ms_attendance.dto.request.AttendanceRequest;
import com.bookclass.ms_attendance.dto.response.AttendanceResponse;
import com.bookclass.ms_attendance.dto.response.AttendanceSummaryResponse;
import com.bookclass.ms_attendance.exception.ResourceNotFoundException;
import com.bookclass.ms_attendance.model.entity.AttendanceRecord;
import com.bookclass.ms_attendance.model.entity.AttendanceStatus;
import com.bookclass.ms_attendance.repository.AttendanceRepository;
import com.bookclass.ms_attendance.service.impl.AttendanceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class AttendanceServiceImplTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    private AttendanceRecord testRecord;
    private AttendanceRequest attendanceRequest;

    @BeforeEach
    void setUp() {
        testRecord = new AttendanceRecord();
        testRecord.setId(1L);
        testRecord.setStudentId(1L);
        testRecord.setFecha(LocalDate.of(2026, 6, 19));
        testRecord.setStatus(AttendanceStatus.PRESENTE);
        testRecord.setObservacion("Asistió");
        testRecord.setRegisteredBy(10L);

        attendanceRequest = AttendanceRequest.builder()
                .studentId(1L)
                .fecha(LocalDate.of(2026, 6, 19))
                .status(AttendanceStatus.PRESENTE)
                .observacion("Asistió")
                .registeredBy(10L)
                .build();
    }

    @Test
    void recordAttendance_shouldReturnAttendanceResponse() {
        when(attendanceRepository.findByStudentIdAndFecha(1L, LocalDate.of(2026, 6, 19)))
                .thenReturn(Optional.empty());
        when(attendanceRepository.save(any(AttendanceRecord.class))).thenReturn(testRecord);

        AttendanceResponse response = attendanceService.recordAttendance(attendanceRequest);

        assertNotNull(response);
        assertEquals(1L, response.getStudentId());
        assertEquals(AttendanceStatus.PRESENTE, response.getStatus());
        verify(attendanceRepository, times(1)).save(any(AttendanceRecord.class));
    }

    @Test
    void recordAttendance_shouldThrowWhenAlreadyExists() {
        when(attendanceRepository.findByStudentIdAndFecha(1L, LocalDate.of(2026, 6, 19)))
                .thenReturn(Optional.of(testRecord));

        assertThrows(IllegalArgumentException.class, () -> attendanceService.recordAttendance(attendanceRequest));
        verify(attendanceRepository, never()).save(any(AttendanceRecord.class));
    }

    @Test
    void updateAttendance_shouldReturnUpdatedAttendance() {
        AttendanceRequest updateRequest = AttendanceRequest.builder()
                .studentId(1L)
                .fecha(LocalDate.of(2026, 6, 19))
                .status(AttendanceStatus.AUSENTE)
                .observacion("No asistió")
                .build();

        when(attendanceRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        when(attendanceRepository.save(any(AttendanceRecord.class))).thenReturn(testRecord);

        AttendanceResponse response = attendanceService.updateAttendance(1L, updateRequest);

        assertNotNull(response);
        verify(attendanceRepository, times(1)).save(any(AttendanceRecord.class));
    }

    @Test
    void updateAttendance_shouldThrowWhenNotFound() {
        when(attendanceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> attendanceService.updateAttendance(99L, attendanceRequest));
    }

    @Test
    void getAttendanceById_shouldReturnAttendance() {
        when(attendanceRepository.findById(1L)).thenReturn(Optional.of(testRecord));

        AttendanceResponse response = attendanceService.getAttendanceById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void getAttendanceById_shouldThrowWhenNotFound() {
        when(attendanceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> attendanceService.getAttendanceById(99L));
    }

    @Test
    void getAttendanceByStudent_shouldReturnList() {
        when(attendanceRepository.findByStudentIdOrderByFechaDesc(1L)).thenReturn(List.of(testRecord));

        List<AttendanceResponse> response = attendanceService.getAttendanceByStudent(1L);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAttendanceByStudentAndDateRange_shouldReturnList() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);
        when(attendanceRepository.findByStudentIdAndFechaBetweenOrderByFecha(1L, start, end))
                .thenReturn(List.of(testRecord));

        List<AttendanceResponse> response = attendanceService.getAttendanceByStudentAndDateRange(1L, start, end);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAttendanceByDate_shouldReturnList() {
        LocalDate date = LocalDate.of(2026, 6, 19);
        when(attendanceRepository.findByFechaOrderByStudentId(date)).thenReturn(List.of(testRecord));

        List<AttendanceResponse> response = attendanceService.getAttendanceByDate(date);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAttendanceSummary_shouldReturnSummaryWithOKStatus() {
        when(attendanceRepository.countByStudentId(1L)).thenReturn(100L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.PRESENTE)).thenReturn(90L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.AUSENTE)).thenReturn(5L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.ATRASADO)).thenReturn(3L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.JUSTIFICADO)).thenReturn(2L);

        AttendanceSummaryResponse response = attendanceService.getAttendanceSummary(1L);

        assertNotNull(response);
        assertEquals(1L, response.getStudentId());
        assertEquals(100L, response.getTotalDays());
        assertEquals(new BigDecimal("95.00"), response.getAttendancePercentage());
        assertEquals("OK", response.getStatus());
    }

    @Test
    void getAttendanceSummary_shouldReturnAtRiskStatus() {
        when(attendanceRepository.countByStudentId(1L)).thenReturn(100L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.PRESENTE)).thenReturn(70L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.AUSENTE)).thenReturn(25L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.ATRASADO)).thenReturn(3L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.JUSTIFICADO)).thenReturn(2L);

        AttendanceSummaryResponse response = attendanceService.getAttendanceSummary(1L);

        assertNotNull(response);
        assertEquals(new BigDecimal("75.00"), response.getAttendancePercentage());
        assertEquals("AT_RISK", response.getStatus());
    }

    @Test
    void getAttendanceSummary_shouldReturnCriticalStatus() {
        when(attendanceRepository.countByStudentId(1L)).thenReturn(100L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.PRESENTE)).thenReturn(50L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.AUSENTE)).thenReturn(45L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.ATRASADO)).thenReturn(3L);
        when(attendanceRepository.countByStudentIdAndStatus(1L, AttendanceStatus.JUSTIFICADO)).thenReturn(2L);

        AttendanceSummaryResponse response = attendanceService.getAttendanceSummary(1L);

        assertNotNull(response);
        assertEquals(new BigDecimal("55.00"), response.getAttendancePercentage());
        assertEquals("CRITICAL", response.getStatus());
    }

    @Test
    void getAttendanceSummaryByDateRange_shouldReturnSummary() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);

        when(attendanceRepository.countByStudentIdAndFechaBetween(1L, start, end)).thenReturn(20L);
        when(attendanceRepository.countByStudentIdAndStatusAndDateRange(
                1L, AttendanceStatus.PRESENTE, start, end)).thenReturn(18L);
        when(attendanceRepository.countByStudentIdAndStatusAndDateRange(
                1L, AttendanceStatus.AUSENTE, start, end)).thenReturn(1L);
        when(attendanceRepository.countByStudentIdAndStatusAndDateRange(
                1L, AttendanceStatus.ATRASADO, start, end)).thenReturn(1L);
        when(attendanceRepository.countByStudentIdAndStatusAndDateRange(
                1L, AttendanceStatus.JUSTIFICADO, start, end)).thenReturn(0L);

        AttendanceSummaryResponse response = attendanceService.getAttendanceSummaryByDateRange(1L, start, end);

        assertNotNull(response);
        assertEquals(20L, response.getTotalDays());
        assertEquals(new BigDecimal("95.00"), response.getAttendancePercentage());
    }

    @Test
    void deleteAttendance_shouldDeleteRecord() {
        when(attendanceRepository.existsById(1L)).thenReturn(true);
        doNothing().when(attendanceRepository).deleteById(1L);

        attendanceService.deleteAttendance(1L);

        verify(attendanceRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteAttendance_shouldThrowWhenNotFound() {
        when(attendanceRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> attendanceService.deleteAttendance(99L));
        verify(attendanceRepository, never()).deleteById(any());
    }
}
