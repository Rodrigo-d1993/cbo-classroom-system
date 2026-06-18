package com.bookclass.ms_grades.service;

import com.bookclass.ms_grades.dto.request.GradeRequest;
import com.bookclass.ms_grades.dto.response.AverageResponse;
import com.bookclass.ms_grades.dto.response.GradeResponse;

import java.util.List;

public interface GradeService {
    GradeResponse createGrade(GradeRequest request);
    GradeResponse getGradeById(Long id);
    List<GradeResponse> getGradesByStudent(Long studentId);
    List<GradeResponse> getGradesByStudentAndSubject(Long studentId, Long subjectId);
    AverageResponse getAverageByStudent(Long studentId);
    AverageResponse getAverageByStudentAndSubject(Long studentId, Long subjectId);
    GradeResponse updateGrade(Long id, GradeRequest request);
    void deleteGrade(Long id);
}
