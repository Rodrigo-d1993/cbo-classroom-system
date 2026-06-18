package com.bookclass.ms_students.service;

import com.bookclass.ms_students.dto.request.StudentRequest;
import com.bookclass.ms_students.dto.response.StudentResponse;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse getStudentById(Long id);
    StudentResponse getStudentByRut(String rut);
    List<StudentResponse> getAllStudents();
    List<StudentResponse> getStudentsByCurso(String curso);
    StudentResponse updateStudent(Long id, StudentRequest request);
    void deactivateStudent(Long id);
    void addGuardianToStudent(Long studentId, Long guardianId);
}
