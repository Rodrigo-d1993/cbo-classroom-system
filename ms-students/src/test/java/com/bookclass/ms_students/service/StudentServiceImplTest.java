package com.bookclass.ms_students.service;

import com.bookclass.ms_students.dto.request.StudentRequest;
import com.bookclass.ms_students.dto.response.StudentResponse;
import com.bookclass.ms_students.exception.ResourceNotFoundException;
import com.bookclass.ms_students.model.entity.Guardian;
import com.bookclass.ms_students.model.entity.Student;
import com.bookclass.ms_students.repository.GuardianRepository;
import com.bookclass.ms_students.repository.StudentRepository;
import com.bookclass.ms_students.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private GuardianRepository guardianRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student testStudent;
    private Guardian testGuardian;
    private StudentRequest studentRequest;

    @BeforeEach
    void setUp() {
        testGuardian = Guardian.builder()
                .id(1L)
                .rut("12345678-9")
                .nombre("Juan")
                .apellido("Perez")
                .email("juan@test.com")
                .telefono("+56912345678")
                .relacion("Padre")
                .active(true)
                .build();

        testStudent = Student.builder()
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
    void createStudent_shouldReturnStudentResponse() {
        when(studentRepository.existsByRut("98765432-1")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        StudentResponse response = studentService.createStudent(studentRequest);

        assertNotNull(response);
        assertEquals("98765432-1", response.getRut());
        assertEquals("Pedro", response.getNombre());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenRutExists() {
        when(studentRepository.existsByRut("98765432-1")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> studentService.createStudent(studentRequest));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void getStudentById_shouldReturnStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));

        StudentResponse response = studentService.getStudentById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Pedro", response.getNombre());
    }

    @Test
    void getStudentById_shouldThrowWhenNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.getStudentById(99L));
    }

    @Test
    void getStudentByRut_shouldReturnStudent() {
        when(studentRepository.findByRut("98765432-1")).thenReturn(Optional.of(testStudent));

        StudentResponse response = studentService.getStudentByRut("98765432-1");

        assertNotNull(response);
        assertEquals("98765432-1", response.getRut());
    }

    @Test
    void getStudentByRut_shouldThrowWhenNotFound() {
        when(studentRepository.findByRut("00000000-0")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.getStudentByRut("00000000-0"));
    }

    @Test
    void getAllStudents_shouldReturnList() {
        when(studentRepository.findByActiveTrue()).thenReturn(List.of(testStudent));

        List<StudentResponse> response = studentService.getAllStudents();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("Pedro", response.get(0).getNombre());
    }

    @Test
    void getStudentsByCurso_shouldReturnList() {
        when(studentRepository.findByCurso("8°A")).thenReturn(List.of(testStudent));

        List<StudentResponse> response = studentService.getStudentsByCurso("8°A");

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("8°A", response.get(0).getCurso());
    }

    @Test
    void updateStudent_shouldReturnUpdatedStudent() {
        StudentRequest updateRequest = StudentRequest.builder()
                .rut("98765432-1")
                .nombre("Pedro Actualizado")
                .apellido("González")
                .email("pedro.nuevo@test.com")
                .fechaNacimiento(LocalDate.of(2010, 5, 15))
                .curso("9°A")
                .build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        StudentResponse response = studentService.updateStudent(1L, updateRequest);

        assertNotNull(response);
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void updateStudent_shouldThrowWhenNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.updateStudent(99L, studentRequest));
    }

    @Test
    void deactivateStudent_shouldSetActiveToFalse() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        studentService.deactivateStudent(1L);

        assertFalse(testStudent.isActive());
        verify(studentRepository, times(1)).save(testStudent);
    }

    @Test
    void deactivateStudent_shouldThrowWhenNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.deactivateStudent(99L));
    }

    @Test
    void addGuardianToStudent_shouldAddGuardian() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(guardianRepository.findById(1L)).thenReturn(Optional.of(testGuardian));
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        studentService.addGuardianToStudent(1L, 1L);

        assertTrue(testStudent.getGuardians().contains(testGuardian));
        verify(studentRepository, times(1)).save(testStudent);
    }

    @Test
    void addGuardianToStudent_shouldThrowWhenStudentNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.addGuardianToStudent(99L, 1L));
    }

    @Test
    void addGuardianToStudent_shouldThrowWhenGuardianNotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(guardianRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.addGuardianToStudent(1L, 99L));
    }
}
