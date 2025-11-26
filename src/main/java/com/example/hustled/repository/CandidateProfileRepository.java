package com.example.hustled.repository;

import com.example.hustled.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for CandidateProfile entity
 * Handles database operations for candidate profiles
 */
@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    
    /**
     * Find candidate profile by user ID
     * @param userId the user ID
     * @return Optional containing the profile if found
     */
    Optional<CandidateProfile> findByUserId(Long userId);
    
    /**
     * Check if profile exists for user
     * @param userId the user ID
     * @return true if profile exists
     */
    boolean existsByUserId(Long userId);
}
