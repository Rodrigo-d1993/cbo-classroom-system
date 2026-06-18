package com.bookclass.ms_attendance.controller;

import com.bookclass.ms_attendance.dto.request.JustificationRequest;
import com.bookclass.ms_attendance.dto.response.JustificationResponse;
import com.bookclass.ms_attendance.service.JustificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/justifications")
@RequiredArgsConstructor
@Tag(name = "Justifications", description = "Absence justification management endpoints")
public class JustificationController {

    private final JustificationService justificationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('APODERADO', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Create justification for an absence")
    public ResponseEntity<JustificationResponse> createJustification(@Valid @RequestBody JustificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(justificationService.createJustification(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Approve justification (changes attendance status to JUSTIFIED)")
    public ResponseEntity<JustificationResponse> approveJustification(
            @PathVariable Long id,
            @RequestParam Long approvedBy) {
        return ResponseEntity.ok(justificationService.approveJustification(id, approvedBy));
    }

    @DeleteMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Reject justification")
    public ResponseEntity<Void> rejectJustification(@PathVariable Long id) {
        justificationService.rejectJustification(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('APODERADO', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Get justification by ID")
    public ResponseEntity<JustificationResponse> getJustificationById(@PathVariable Long id) {
        return ResponseEntity.ok(justificationService.getJustificationById(id));
    }

    @GetMapping("/attendance/{attendanceId}")
    @PreAuthorize("hasAnyRole('APODERADO', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Get justification by attendance ID")
    public ResponseEntity<JustificationResponse> getJustificationByAttendanceId(@PathVariable Long attendanceId) {
        return ResponseEntity.ok(justificationService.getJustificationByAttendanceId(attendanceId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Get all pending justifications")
    public ResponseEntity<List<JustificationResponse>> getPendingJustifications() {
        return ResponseEntity.ok(justificationService.getPendingJustifications());
    }

    @GetMapping("/approved-by/{userId}")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Get justifications approved by a user")
    public ResponseEntity<List<JustificationResponse>> getApprovedByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(justificationService.getApprovedByUser(userId));
    }
}
