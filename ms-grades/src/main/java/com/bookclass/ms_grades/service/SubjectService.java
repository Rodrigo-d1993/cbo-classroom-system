package com.bookclass.ms_grades.service;

import com.bookclass.ms_grades.dto.request.SubjectRequest;
import com.bookclass.ms_grades.dto.response.SubjectResponse;

import java.util.List;

public interface SubjectService {
    SubjectResponse createSubject(SubjectRequest request);
    SubjectResponse getSubjectById(Long id);
    SubjectResponse getSubjectByCodigo(String codigo);
    List<SubjectResponse> getAllActiveSubjects();
    SubjectResponse updateSubject(Long id, SubjectRequest request);
    void deactivateSubject(Long id);
}
