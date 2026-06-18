package com.bookclass.ms_attendance.controller;

import com.bookclass.ms_attendance.dto.request.AttendanceRequest;
import com.bookclass.ms_attendance.dto.response.AttendanceResponse;
import com.bookclass.ms_attendance.dto.response.AttendanceSummaryResponse;
import com.bookclass.ms_attendance.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance management endpoints")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Record attendance")
    public ResponseEntity<AttendanceResponse> recordAttendance(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.recordAttendance(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Update attendance record")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get attendance record by ID")
    public ResponseEntity<AttendanceResponse> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get all attendance records for a student")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/range")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get attendance records for a student in date range")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudentAndDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudentAndDateRange(studentId, startDate, endDate));
    }

    @GetMapping("/date/{fecha}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Get all attendance records for a specific date")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(fecha));
    }

    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get attendance summary for a student (all time)")
    public ResponseEntity<AttendanceSummaryResponse> getAttendanceSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceSummary(studentId));
    }

    @GetMapping("/student/{studentId}/summary/range")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get attendance summary for a student in date range")
    public ResponseEntity<AttendanceSummaryResponse> getAttendanceSummaryByDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceSummaryByDateRange(studentId, startDate, endDate));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Delete attendance record")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
