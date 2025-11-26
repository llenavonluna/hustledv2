package com.example.hustled.controller;

import com.example.hustled.dto.CandidateProfileDTO;
import com.example.hustled.dto.ApiResponse;
import com.example.hustled.model.CandidateProfile;
import com.example.hustled.entity.User;
import com.example.hustled.repository.CandidateProfileRepository;
import com.example.hustled.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/candidate")
@CrossOrigin(origins = "*")
public class CandidateProfileController {
    
    @Autowired
    private CandidateProfileRepository candidateProfileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save or Update Candidate Profile
     * POST /api/candidate/profile/save
     */
    @PostMapping("/profile/save")
    public ResponseEntity<?> saveProfile(@RequestBody CandidateProfileDTO dto) {
        try {
            // Extract user ID from authentication context or DTO
            Long userId = getCurrentUserId();
            
            // If no authenticated user, try to get from DTO
            if (userId == null && dto.getUserId() != null) {
                userId = dto.getUserId();
            }
            
            if (userId == null) {
                return ResponseEntity.status(401)
                    .body(new ApiResponse("❌ Unauthorized: Please login first or provide user ID", false));
            }
            
            // Find existing profile or create new one
            Optional<CandidateProfile> existingProfile = candidateProfileRepository.findByUserId(userId);
            CandidateProfile profile = existingProfile.orElse(new CandidateProfile());
            
            // Update profile fields
            profile.setUserId(userId);
            profile.setFirstName(dto.getFirstName());
            profile.setLastName(dto.getLastName());
            profile.setHeadline(dto.getHeadline());
            profile.setBio(dto.getBio());
            profile.setCity(dto.getCity());
            profile.setProvince(dto.getProvince());
            profile.setPostalCode(dto.getPostalCode());
            profile.setPhone(dto.getPhone());
            profile.setPortfolio(dto.getPortfolio());
            profile.setLinkedin(dto.getLinkedin());
            profile.setGithub(dto.getGithub());
            profile.setWebsite(dto.getWebsite());
            profile.setDateOfBirth(dto.getDateOfBirth());
            if (dto.getGender() != null && !dto.getGender().isEmpty()) {
                profile.setGender(CandidateProfile.Gender.valueOf(dto.getGender()));
            }
            profile.setAddress(dto.getAddress());
            profile.setIsProfileComplete(true);
            
            // Save to database
            candidateProfileRepository.save(profile);
            
            return ResponseEntity.ok(
                new ApiResponse("✅ Profile saved successfully", true)
            );
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ApiResponse("❌ Error saving profile: " + e.getMessage(), false));
        }
    }
    
    /**
     * Get Candidate Profile
     * GET /api/candidate/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(401)
                    .body(new ApiResponse("Unauthorized: Please login first", false));
            }
            
            Optional<CandidateProfile> profile = candidateProfileRepository.findByUserId(userId);
            
            if (profile.isPresent()) {
                return ResponseEntity.ok(profile.get());
            } else {
                return ResponseEntity.ok(new CandidateProfile());
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ApiResponse("Error loading profile: " + e.getMessage(), false));
        }
    }
    
    /**
     * Get Candidate ID by User ID
     * GET /api/candidate/id
     */
    @GetMapping("/id")
    public ResponseEntity<?> getCandidateId() {
        try {
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(401)
                    .body(new ApiResponse("Unauthorized", false));
            }
            
            Optional<CandidateProfile> profile = candidateProfileRepository.findByUserId(userId);
            if (profile.isPresent()) {
                return ResponseEntity.ok("{\"candidateId\": " + profile.get().getId() + "}");
            } else {
                return ResponseEntity.status(404)
                    .body(new ApiResponse("Profile not found", false));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new ApiResponse("Error: " + e.getMessage(), false));
        }
    }
    
    /**
     * Helper method to extract current user ID from authentication
     */
    private Long getCurrentUserId() {
        try {
            // Try to get from Spring Security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                if (principal instanceof User) {
                    return ((User) principal).getId();
                }
            }
            
            // If not available, return null (client should handle with localStorage fallback)
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
