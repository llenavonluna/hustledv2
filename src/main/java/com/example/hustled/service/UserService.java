package com.example.hustled.service;

import com.example.hustled.entity.User;
import com.example.hustled.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository userRepo, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public boolean register(User user){
        if (userRepo.existsByUsername(user.getUsername())) {
            return false;
        }
        user.setPassword(encoder.encode(user.getPassword()));
        
        // Set default role if not already set
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        User newUser = null;
        try{
            newUser = userRepo.save(user);
        }catch (Exception ex){
            ex.printStackTrace();
            return false;
        }
        
        System.out.println("New User: " + (newUser != null ? newUser.getId() : null) + " | " + (newUser != null ? newUser.getUsername() : null) + " | " + (newUser != null ? newUser.getEmail() : null) + " | " + (newUser != null ? newUser.getPhone() : null) + " | " + (newUser != null ? newUser.getRole() : null));

        return true;
    }

    /**
     * Authenticate a candidate user by username and password
     */
    public boolean authenticateCandidate(String username, String password) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Check if user is a CANDIDATE
            if ("CANDIDATE".equals(user.getRole()) || "USER".equals(user.getRole())) {
                return encoder.matches(password, user.getPassword());
            }
        }
        return false;
    }

    /**
     * Authenticate an admin user by username and password
     */
    public boolean authenticateAdmin(String username, String password) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Check if user is an ADMIN
            if ("ADMIN".equals(user.getRole())) {
                return encoder.matches(password, user.getPassword());
            }
        }
        return false;
    }

    /**
     * Find user by username
     */
    public User findByUsername(String username) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        return userOpt.orElse(null);
    }

    /**
     * Find user by ID
     */
    public User findById(Long id) {
        Optional<User> userOpt = userRepo.findById(id);
        return userOpt.orElse(null);
    }
}
