package com.bookclass.ms_grades.service.impl;

import com.bookclass.ms_grades.dto.request.SubjectRequest;
import com.bookclass.ms_grades.dto.response.SubjectResponse;
import com.bookclass.ms_grades.exception.ResourceNotFoundException;
import com.bookclass.ms_grades.model.entity.Subject;
import com.bookclass.ms_grades.repository.SubjectRepository;
import com.bookclass.ms_grades.service.SubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        if (subjectRepository.existsByCodigo(request.getCodigo())) {
            throw new IllegalArgumentException("Subject code already exists: " + request.getCodigo());
        }

        Subject subject = Subject.builder()
                .nombre(request.getNombre())
                .codigo(request.getCodigo().toUpperCase())
                .descripcion(request.getDescripcion())
                .build();

        Subject saved = subjectRepository.save(subject);
        log.info("Subject created: {} ({})", saved.getNombre(), saved.getCodigo());

        return mapToResponse(saved);
    }

    @Override
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));
        return mapToResponse(subject);
    }

    @Override
    public SubjectResponse getSubjectByCodigo(String codigo) {
        Subject subject = subjectRepository.findByCodigo(codigo.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + codigo));
        return mapToResponse(subject);
    }

    @Override
    public List<SubjectResponse> getAllActiveSubjects() {
        return subjectRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));

        subject.setNombre(request.getNombre());
        subject.setDescripcion(request.getDescripcion());

        Subject updated = subjectRepository.save(subject);
        log.info("Subject updated: {}", updated.getNombre());

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deactivateSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));

        subject.setActive(false);
        subjectRepository.save(subject);
        log.info("Subject deactivated: {}", subject.getNombre());
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .nombre(subject.getNombre())
                .codigo(subject.getCodigo())
                .descripcion(subject.getDescripcion())
                .active(subject.isActive())
                .createdAt(subject.getCreatedAt())
                .build();
    }
}
