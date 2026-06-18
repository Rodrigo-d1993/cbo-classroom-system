package com.bookclass.ms_attendance.service.impl;

import com.bookclass.ms_attendance.dto.request.AttendanceRequest;
import com.bookclass.ms_attendance.dto.response.AttendanceResponse;
import com.bookclass.ms_attendance.dto.response.AttendanceSummaryResponse;
import com.bookclass.ms_attendance.exception.ResourceNotFoundException;
import com.bookclass.ms_attendance.model.entity.AttendanceRecord;
import com.bookclass.ms_attendance.model.entity.AttendanceStatus;
import com.bookclass.ms_attendance.repository.AttendanceRepository;
import com.bookclass.ms_attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Override
    @Transactional
    public AttendanceResponse recordAttendance(AttendanceRequest request) {
        // Verificar si ya existe registro para ese día
        attendanceRepository.findByStudentIdAndFecha(request.getStudentId(), request.getFecha())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                        "Attendance already recorded for student " + request.getStudentId() +
                        " on date " + request.getFecha()
                    );
                });

        AttendanceRecord record = new AttendanceRecord();
        record.setStudentId(request.getStudentId());
        record.setFecha(request.getFecha());
        record.setStatus(request.getStatus());
        record.setObservacion(request.getObservacion());
        record.setRegisteredBy(request.getRegisteredBy());

        AttendanceRecord saved = attendanceRepository.save(record);
        log.info("Attendance recorded: student={}, date={}, status={}",
                saved.getStudentId(), saved.getFecha(), saved.getStatus());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        AttendanceRecord record = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));

        record.setStatus(request.getStatus());
        record.setObservacion(request.getObservacion());

        AttendanceRecord updated = attendanceRepository.save(record);
        log.info("Attendance updated: id={}, new status={}", id, updated.getStatus());

        return mapToResponse(updated);
    }

    @Override
    public AttendanceResponse getAttendanceById(Long id) {
        AttendanceRecord record = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));
        return mapToResponse(record);
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByFechaDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudentAndDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByStudentIdAndFechaBetweenOrderByFecha(studentId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getAttendanceByDate(LocalDate fecha) {
        return attendanceRepository.findByFechaOrderByStudentId(fecha)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceSummaryResponse getAttendanceSummary(Long studentId) {
        Long totalDays = attendanceRepository.countByStudentId(studentId);
        Long presentDays = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENTE);
        Long absentDays = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.AUSENTE);
        Long lateDays = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.ATRASADO);
        Long justifiedDays = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.JUSTIFICADO);

        return buildSummary(studentId, totalDays, presentDays, absentDays, lateDays, justifiedDays);
    }

    @Override
    public AttendanceSummaryResponse getAttendanceSummaryByDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate) {
        Long totalDays = attendanceRepository.countByStudentIdAndFechaBetween(studentId, startDate, endDate);
        Long presentDays = attendanceRepository.countByStudentIdAndStatusAndDateRange(
                studentId, AttendanceStatus.PRESENTE, startDate, endDate);
        Long absentDays = attendanceRepository.countByStudentIdAndStatusAndDateRange(
                studentId, AttendanceStatus.AUSENTE, startDate, endDate);
        Long lateDays = attendanceRepository.countByStudentIdAndStatusAndDateRange(
                studentId, AttendanceStatus.ATRASADO, startDate, endDate);
        Long justifiedDays = attendanceRepository.countByStudentIdAndStatusAndDateRange(
                studentId, AttendanceStatus.JUSTIFICADO, startDate, endDate);

        return buildSummary(studentId, totalDays, presentDays, absentDays, lateDays, justifiedDays);
    }

    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record not found with id: " + id);
        }
        attendanceRepository.deleteById(id);
        log.info("Attendance record deleted: id={}", id);
    }

    private AttendanceSummaryResponse buildSummary(
            Long studentId, Long totalDays, Long presentDays,
            Long absentDays, Long lateDays, Long justifiedDays) {

        // Calcular porcentaje: (PRESENTE + ATRASADO + JUSTIFICADO) / TOTAL * 100
        // En Chile, los atrasos y justificados cuentan como asistencia
        Long effectivePresent = presentDays + lateDays + justifiedDays;
        
        BigDecimal percentage = BigDecimal.ZERO;
        if (totalDays > 0) {
            percentage = BigDecimal.valueOf(effectivePresent)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalDays), 2, RoundingMode.HALF_UP);
        }

        // Determinar estado según porcentaje
        String status;
        if (percentage.compareTo(BigDecimal.valueOf(85)) >= 0) {
            status = "OK"; // Cumple con el 85% mínimo
        } else if (percentage.compareTo(BigDecimal.valueOf(70)) >= 0) {
            status = "AT_RISK"; // Entre 70-85%, en riesgo
        } else {
            status = "CRITICAL"; // Menos de 70%, crítico
        }

        return AttendanceSummaryResponse.builder()
                .studentId(studentId)
                .totalDays(totalDays)
                .presentDays(presentDays)
                .absentDays(absentDays)
                .lateDays(lateDays)
                .justifiedDays(justifiedDays)
                .attendancePercentage(percentage)
                .status(status)
                .build();
    }

    private AttendanceResponse mapToResponse(AttendanceRecord record) {
        return AttendanceResponse.builder()
                .id(record.getId())
                .studentId(record.getStudentId())
                .fecha(record.getFecha())
                .status(record.getStatus())
                .observacion(record.getObservacion())
                .registeredBy(record.getRegisteredBy())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
