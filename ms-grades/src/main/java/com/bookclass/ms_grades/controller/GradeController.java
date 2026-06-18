package com.bookclass.ms_grades.controller;

import com.bookclass.ms_grades.dto.request.GradeRequest;
import com.bookclass.ms_grades.dto.response.AverageResponse;
import com.bookclass.ms_grades.dto.response.GradeResponse;
import com.bookclass.ms_grades.service.GradeService;
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
@RequestMapping("/api/grades")
@RequiredArgsConstructor
@Tag(name = "Grades", description = "Grade management endpoints")
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE')")
    @Operation(summary = "Register a new grade")
    public ResponseEntity<GradeResponse> createGrade(@Valid @RequestBody GradeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gradeService.createGrade(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR')")
    @Operation(summary = "Get grade by ID")
    public ResponseEntity<GradeResponse> getGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.getGradeById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR', 'APODERADO')")
    @Operation(summary = "Get all grades for a student")
    public ResponseEntity<List<GradeResponse>> getGradesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getGradesByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR', 'APODERADO')")
    @Operation(summary = "Get grades for a student in a specific subject")
    public ResponseEntity<List<GradeResponse>> getGradesByStudentAndSubject(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.getGradesByStudentAndSubject(studentId, subjectId));
    }

    @GetMapping("/student/{studentId}/average")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR', 'APODERADO')")
    @Operation(summary = "Get general average for a student")
    public ResponseEntity<AverageResponse> getAverageByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getAverageByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}/average")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR', 'APODERADO')")
    @Operation(summary = "Get average for a student in a specific subject")
    public ResponseEntity<AverageResponse> getAverageByStudentAndSubject(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.getAverageByStudentAndSubject(studentId, subjectId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE')")
    @Operation(summary = "Update a grade")
    public ResponseEntity<GradeResponse> updateGrade(
            @PathVariable Long id,
            @Valid @RequestBody GradeRequest request) {
        return ResponseEntity.ok(gradeService.updateGrade(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR')")
    @Operation(summary = "Delete a grade")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }
}
