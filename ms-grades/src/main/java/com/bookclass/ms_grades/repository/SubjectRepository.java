package com.bookclass.ms_grades.repository;

import com.bookclass.ms_grades.model.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCodigo(String codigo);
    List<Subject> findByActiveTrue();
    boolean existsByCodigo(String codigo);
}
