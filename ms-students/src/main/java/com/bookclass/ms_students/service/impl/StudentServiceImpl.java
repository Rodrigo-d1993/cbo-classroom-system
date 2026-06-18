package com.bookclass.ms_students.service.impl;

import com.bookclass.ms_students.dto.request.StudentRequest;
import com.bookclass.ms_students.dto.response.StudentResponse;
import com.bookclass.ms_students.dto.response.GuardianResponse;
import com.bookclass.ms_students.exception.ResourceNotFoundException;
import com.bookclass.ms_students.model.entity.Student;
import com.bookclass.ms_students.model.entity.Guardian;
import com.bookclass.ms_students.repository.StudentRepository;
import com.bookclass.ms_students.repository.GuardianRepository;
import com.bookclass.ms_students.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final GuardianRepository guardianRepository;

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByRut(request.getRut())) {
            throw new IllegalArgumentException("Student with RUT " + request.getRut() + " already exists");
        }

        Student student = Student.builder()
                .rut(request.getRut())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .fechaNacimiento(request.getFechaNacimiento())
                .curso(request.getCurso())
                .guardians(new HashSet<>())
                .build();

        Student saved = studentRepository.save(student);
        log.info("Student created: {} {} (RUT: {})", saved.getNombre(), saved.getApellido(), saved.getRut());
        
        return mapToResponse(saved);
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    @Override
    public StudentResponse getStudentByRut(String rut) {
        Student student = studentRepository.findByRut(rut)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with RUT: " + rut));
        return mapToResponse(student);
    }

    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponse> getStudentsByCurso(String curso) {
        return studentRepository.findByCurso(curso)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setNombre(request.getNombre());
        student.setApellido(request.getApellido());
        student.setEmail(request.getEmail());
        student.setFechaNacimiento(request.getFechaNacimiento());
        student.setCurso(request.getCurso());

        Student updated = studentRepository.save(student);
        log.info("Student updated: {} {} (ID: {})", updated.getNombre(), updated.getApellido(), updated.getId());
        
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deactivateStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        student.setActive(false);
        studentRepository.save(student);
        log.info("Student deactivated: {} {} (ID: {})", student.getNombre(), student.getApellido(), student.getId());
    }

    @Override
    @Transactional
    public void addGuardianToStudent(Long studentId, Long guardianId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Guardian guardian = guardianRepository.findById(guardianId)
                .orElseThrow(() -> new ResourceNotFoundException("Guardian not found with id: " + guardianId));

        student.getGuardians().add(guardian);
        studentRepository.save(student);
        log.info("Guardian {} added to student {}", guardianId, studentId);
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .rut(student.getRut())
                .nombre(student.getNombre())
                .apellido(student.getApellido())
                .email(student.getEmail())
                .fechaNacimiento(student.getFechaNacimiento())
                .curso(student.getCurso())
                .active(student.isActive())
                .createdAt(student.getCreatedAt())
                .guardians(student.getGuardians() != null ? 
                    student.getGuardians().stream()
                        .map(this::mapGuardianToResponse)
                        .collect(Collectors.toSet()) : new HashSet<>())
                .build();
    }

    private GuardianResponse mapGuardianToResponse(Guardian guardian) {
        return GuardianResponse.builder()
                .id(guardian.getId())
                .rut(guardian.getRut())
                .nombre(guardian.getNombre())
                .apellido(guardian.getApellido())
                .email(guardian.getEmail())
                .telefono(guardian.getTelefono())
                .relacion(guardian.getRelacion())
                .active(guardian.isActive())
                .createdAt(guardian.getCreatedAt())
                .build();
    }
}
