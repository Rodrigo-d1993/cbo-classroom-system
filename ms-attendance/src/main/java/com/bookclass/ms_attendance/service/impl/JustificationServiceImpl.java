package com.bookclass.ms_attendance.service.impl;

import com.bookclass.ms_attendance.dto.request.JustificationRequest;
import com.bookclass.ms_attendance.dto.response.JustificationResponse;
import com.bookclass.ms_attendance.exception.ResourceNotFoundException;
import com.bookclass.ms_attendance.model.entity.AttendanceRecord;
import com.bookclass.ms_attendance.model.entity.AttendanceStatus;
import com.bookclass.ms_attendance.model.entity.Justification;
import com.bookclass.ms_attendance.repository.AttendanceRepository;
import com.bookclass.ms_attendance.repository.JustificationRepository;
import com.bookclass.ms_attendance.service.JustificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JustificationServiceImpl implements JustificationService {

    private final JustificationRepository justificationRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    @Transactional
    public JustificationResponse createJustification(JustificationRequest request) {
        // Verificar que el registro de asistencia existe
        AttendanceRecord attendance = attendanceRepository.findById(request.getAttendanceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance record not found with id: " + request.getAttendanceId()));

        // Verificar que la asistencia sea AUSENTE
        if (attendance.getStatus() != AttendanceStatus.AUSENTE) {
            throw new IllegalArgumentException(
                    "Can only justify absences. Current status: " + attendance.getStatus());
        }

        // Verificar que no exista ya una justificación para esta asistencia
        justificationRepository.findByAttendanceId(request.getAttendanceId())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Justification already exists for attendance id: " + request.getAttendanceId());
                });

        Justification justification = new Justification();
        justification.setAttendanceId(request.getAttendanceId());
        justification.setMotivo(request.getMotivo());
        justification.setDocumentoUrl(request.getDocumentoUrl());
        justification.setApproved(false);

        Justification saved = justificationRepository.save(justification);
        log.info("Justification created: id={}, attendanceId={}", saved.getId(), saved.getAttendanceId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public JustificationResponse approveJustification(Long id, Long approvedBy) {
        Justification justification = justificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Justification not found with id: " + id));

        if (justification.getApproved()) {
            throw new IllegalArgumentException("Justification already approved");
        }

        // Actualizar justificación
        justification.setApproved(true);
        justification.setApprovedBy(approvedBy);
        justification.setApprovedAt(LocalDate.now());

        // Cambiar estado de asistencia de AUSENTE a JUSTIFICADO
        AttendanceRecord attendance = attendanceRepository.findById(justification.getAttendanceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance record not found with id: " + justification.getAttendanceId()));

        attendance.setStatus(AttendanceStatus.JUSTIFICADO);
        attendanceRepository.save(attendance);

        Justification approved = justificationRepository.save(justification);
        log.info("Justification approved: id={}, approvedBy={}", approved.getId(), approvedBy);

        return mapToResponse(approved);
    }

    @Override
    @Transactional
    public void rejectJustification(Long id) {
        Justification justification = justificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Justification not found with id: " + id));

        if (justification.getApproved()) {
            throw new IllegalArgumentException("Cannot reject an already approved justification");
        }

        justificationRepository.deleteById(id);
        log.info("Justification rejected and deleted: id={}", id);
    }

    @Override
    public JustificationResponse getJustificationById(Long id) {
        Justification justification = justificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Justification not found with id: " + id));
        return mapToResponse(justification);
    }

    @Override
    public JustificationResponse getJustificationByAttendanceId(Long attendanceId) {
        Justification justification = justificationRepository.findByAttendanceId(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Justification not found for attendance id: " + attendanceId));
        return mapToResponse(justification);
    }

    @Override
    public List<JustificationResponse> getPendingJustifications() {
        return justificationRepository.findByApprovedOrderByCreatedAtDesc(false)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<JustificationResponse> getApprovedByUser(Long userId) {
        return justificationRepository.findByApprovedByOrderByApprovedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JustificationResponse mapToResponse(Justification justification) {
        return JustificationResponse.builder()
                .id(justification.getId())
                .attendanceId(justification.getAttendanceId())
                .motivo(justification.getMotivo())
                .documentoUrl(justification.getDocumentoUrl())
                .approved(justification.getApproved())
                .approvedBy(justification.getApprovedBy())
                .approvedAt(justification.getApprovedAt())
                .createdAt(justification.getCreatedAt())
                .build();
    }
}
