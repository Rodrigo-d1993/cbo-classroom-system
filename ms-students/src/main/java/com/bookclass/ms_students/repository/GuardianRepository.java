package com.bookclass.ms_students.repository;

import com.bookclass.ms_students.model.entity.Guardian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuardianRepository extends JpaRepository<Guardian, Long> {
    Optional<Guardian> findByRut(String rut);
    boolean existsByRut(String rut);
}
