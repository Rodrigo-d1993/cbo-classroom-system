package com.bookclass.ms_grades.repository;

import com.bookclass.ms_grades.model.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    
    List<Grade> findByStudentId(Long studentId);
    
    List<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    
    @Query("SELECT AVG(g.nota) FROM Grade g WHERE g.studentId = :studentId")
    BigDecimal calculateAverageByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT AVG(g.nota) FROM Grade g WHERE g.studentId = :studentId AND g.subject.id = :subjectId")
    BigDecimal calculateAverageByStudentAndSubject(
        @Param("studentId") Long studentId, 
        @Param("subjectId") Long subjectId
    );
    
    @Query("SELECT COUNT(g) FROM Grade g WHERE g.studentId = :studentId")
    Long countByStudent(@Param("studentId") Long studentId);
}
