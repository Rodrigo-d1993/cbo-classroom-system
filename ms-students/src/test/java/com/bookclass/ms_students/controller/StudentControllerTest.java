package com.bookclass.ms_students.controller;

import com.bookclass.ms_students.dto.request.StudentRequest;
import com.bookclass.ms_students.dto.response.StudentResponse;
import com.bookclass.ms_students.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private StudentService studentService;

    @InjectMocks
    private StudentController studentController;

    private StudentResponse studentResponse;
    private StudentRequest studentRequest;

    @BeforeEach
    void setUp() {
        studentResponse = StudentResponse.builder()
                .id(1L)
                .rut("98765432-1")
                .nombre("Pedro")
                .apellido("González")
                .email("pedro@test.com")
                .fechaNacimiento(LocalDate.of(2010, 5, 15))
                .curso("8°A")
                .active(true)
                .guardians(new HashSet<>())
                .build();

        studentRequest = StudentRequest.builder()
                .rut("98765432-1")
                .nombre("Pedro")
                .apellido("González")
                .email("pedro@test.com")
                .fechaNacimiento(LocalDate.of(2010, 5, 15))
                .curso("8°A")
                .build();
    }

    @Test
    void createStudent_shouldReturn201() {
        when(studentService.createStudent(any(StudentRequest.class))).thenReturn(studentResponse);

        ResponseEntity<StudentResponse> response = studentController.createStudent(studentRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("98765432-1", response.getBody().getRut());
        assertEquals("Pedro", response.getBody().getNombre());
    }

    @Test
    void getAllStudents_shouldReturn200() {
        when(studentService.getAllStudents()).thenReturn(List.of(studentResponse));

        ResponseEntity<List<StudentResponse>> response = studentController.getAllStudents();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getStudentById_shouldReturn200() {
        when(studentService.getStudentById(1L)).thenReturn(studentResponse);

        ResponseEntity<StudentResponse> response = studentController.getStudentById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Pedro", response.getBody().getNombre());
    }

    @Test
    void getStudentByRut_shouldReturn200() {
        when(studentService.getStudentByRut("98765432-1")).thenReturn(studentResponse);

        ResponseEntity<StudentResponse> response = studentController.getStudentByRut("98765432-1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("98765432-1", response.getBody().getRut());
    }

    @Test
    void getStudentsByCurso_shouldReturn200() {
        when(studentService.getStudentsByCurso("8°A")).thenReturn(List.of(studentResponse));

        ResponseEntity<List<StudentResponse>> response = studentController.getStudentsByCurso("8°A");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("8°A", response.getBody().get(0).getCurso());
    }

    @Test
    void updateStudent_shouldReturn200() {
        when(studentService.updateStudent(eq(1L), any(StudentRequest.class))).thenReturn(studentResponse);

        ResponseEntity<StudentResponse> response = studentController.updateStudent(1L, studentRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void deactivateStudent_shouldReturn204() {
        doNothing().when(studentService).deactivateStudent(1L);

        ResponseEntity<Void> response = studentController.deactivateStudent(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(studentService, times(1)).deactivateStudent(1L);
    }

    @Test
    void addGuardian_shouldReturn200() {
        doNothing().when(studentService).addGuardianToStudent(1L, 1L);

        ResponseEntity<Void> response = studentController.addGuardian(1L, 1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(studentService, times(1)).addGuardianToStudent(1L, 1L);
    }
}
