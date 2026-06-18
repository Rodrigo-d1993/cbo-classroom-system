package com.bookclass.ms_grades.controller;

import com.bookclass.ms_grades.dto.request.SubjectRequest;
import com.bookclass.ms_grades.dto.response.SubjectResponse;
import com.bookclass.ms_grades.service.SubjectService;
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
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Tag(name = "Subjects", description = "Subject management endpoints")
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN_SISTEMA')")
    @Operation(summary = "Create new subject")
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.createSubject(request));
    }

    @GetMapping
    @Operation(summary = "Get all active subjects")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllActiveSubjects());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subject by ID")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Get subject by code")
    public ResponseEntity<SubjectResponse> getSubjectByCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(subjectService.getSubjectByCodigo(codigo));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN_SISTEMA')")
    @Operation(summary = "Update subject")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN_SISTEMA')")
    @Operation(summary = "Deactivate subject")
    public ResponseEntity<Void> deactivateSubject(@PathVariable Long id) {
        subjectService.deactivateSubject(id);
        return ResponseEntity.noContent().build();
    }
}
