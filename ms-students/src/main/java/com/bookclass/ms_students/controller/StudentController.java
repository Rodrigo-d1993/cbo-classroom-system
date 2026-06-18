package com.bookclass.ms_students.controller;

import com.bookclass.ms_students.dto.request.StudentRequest;
import com.bookclass.ms_students.dto.response.StudentResponse;
import com.bookclass.ms_students.service.StudentService;
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
@RequestMapping("/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student management endpoints")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR')")
    @Operation(summary = "Create new student")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.createStudent(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR')")
    @Operation(summary = "Get all active students")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR', 'APODERADO')")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/rut/{rut}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR')")
    @Operation(summary = "Get student by RUT")
    public ResponseEntity<StudentResponse> getStudentByRut(@PathVariable String rut) {
        return ResponseEntity.ok(studentService.getStudentByRut(rut));
    }

    @GetMapping("/curso/{curso}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR', 'DOCENTE', 'INSPECTOR')")
    @Operation(summary = "Get students by course")
    public ResponseEntity<List<StudentResponse>> getStudentsByCurso(@PathVariable String curso) {
        return ResponseEntity.ok(studentService.getStudentsByCurso(curso));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR')")
    @Operation(summary = "Update student")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR')")
    @Operation(summary = "Deactivate student")
    public ResponseEntity<Void> deactivateStudent(@PathVariable Long id) {
        studentService.deactivateStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{studentId}/guardians/{guardianId}")
    @PreAuthorize("hasAnyAuthority('ADMIN_SISTEMA', 'DIRECTOR')")
    @Operation(summary = "Add guardian to student")
    public ResponseEntity<Void> addGuardian(
            @PathVariable Long studentId,
            @PathVariable Long guardianId) {
        studentService.addGuardianToStudent(studentId, guardianId);
        return ResponseEntity.ok().build();
    }
}
