package com.bookclass.ms_annotations.controller;

import com.bookclass.ms_annotations.dto.request.AnnotationRequest;
import com.bookclass.ms_annotations.dto.response.AnnotationResponse;
import com.bookclass.ms_annotations.dto.response.AnnotationSummaryResponse;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import com.bookclass.ms_annotations.service.AnnotationService;
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
@RequestMapping("/api/annotations")
@RequiredArgsConstructor
@Tag(name = "Annotations", description = "Annotation management endpoints")
public class AnnotationController {

    private final AnnotationService annotationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Create annotation")
    public ResponseEntity<AnnotationResponse> createAnnotation(@Valid @RequestBody AnnotationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(annotationService.createAnnotation(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Update annotation (only DIRECTOR or ADMIN)")
    public ResponseEntity<AnnotationResponse> updateAnnotation(
            @PathVariable Long id,
            @Valid @RequestBody AnnotationRequest request) {
        return ResponseEntity.ok(annotationService.updateAnnotation(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get annotation by ID")
    public ResponseEntity<AnnotationResponse> getAnnotationById(@PathVariable Long id) {
        return ResponseEntity.ok(annotationService.getAnnotationById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get all annotations for a student")
    public ResponseEntity<List<AnnotationResponse>> getAnnotationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(annotationService.getAnnotationsByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/type/{tipo}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get annotations for a student by type")
    public ResponseEntity<List<AnnotationResponse>> getAnnotationsByStudentAndType(
            @PathVariable Long studentId,
            @PathVariable AnnotationType tipo) {
        return ResponseEntity.ok(annotationService.getAnnotationsByStudentAndType(studentId, tipo));
    }

    @GetMapping("/student/{studentId}/range")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get annotations for a student in date range")
    public ResponseEntity<List<AnnotationResponse>> getAnnotationsByStudentAndDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(annotationService.getAnnotationsByStudentAndDateRange(studentId, startDate, endDate));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Get all annotations registered by a teacher")
    public ResponseEntity<List<AnnotationResponse>> getAnnotationsByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(annotationService.getAnnotationsByTeacher(teacherId));
    }

    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('DOCENTE', 'INSPECTOR', 'DIRECTOR', 'ADMIN_SISTEMA', 'APODERADO')")
    @Operation(summary = "Get behavior summary for a student")
    public ResponseEntity<AnnotationSummaryResponse> getAnnotationSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(annotationService.getAnnotationSummary(studentId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTOR', 'ADMIN_SISTEMA')")
    @Operation(summary = "Delete annotation")
    public ResponseEntity<Void> deleteAnnotation(@PathVariable Long id) {
        annotationService.deleteAnnotation(id);
        return ResponseEntity.noContent().build();
    }
}
