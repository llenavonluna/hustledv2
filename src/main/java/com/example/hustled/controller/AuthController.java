package com.example.hustled.controller;

import com.example.hustled.entity.User;
import com.example.hustled.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // ✅ New endpoint: serve login modal fragment dynamically
    @GetMapping("/modal/login")
    public String getLoginModal(Model model,
                                @RequestParam(value = "fromRegister", required = false) Boolean fromRegister) {

        if (Boolean.TRUE.equals(fromRegister)) {
            model.addAttribute("loginHeader", "Registration Successful");
        } else {
            model.addAttribute("loginHeader", "Login");
        }

        return "fragments/login-modal :: loginModal";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // ✅ New endpoint: serve register modal fragment dynamically
    @GetMapping("/modal/register")
    public String getRegisterModal(Model model) {
        model.addAttribute("user", new User());
        return "fragments/register-modal :: registerModal";
        // fragments/register-modal.html must contain <div th:fragment="registerModal">...</div>
    }

    @PostMapping("/register")
    public String processRegister(@Valid @ModelAttribute("user") User user,
                                  BindingResult result,
                                  Model model) {
        if (result.hasErrors()) {
            return "register";
        }
        boolean ok = userService.register(user);
        if (!ok) {
            model.addAttribute("error", "Username already exists.");
            return "register";
        }
        // ✅ Redirect to index with flag
        return "redirect:/index?showLogin=true";
    }

    // ==================== REST API ENDPOINTS ====================

    /**
     * Sign up endpoint for Candidates
     * POST /api/auth/signup/candidate
     */
    @PostMapping("/api/auth/signup/candidate")
    @ResponseBody
    public ResponseEntity<?> signupCandidate(@RequestBody SignupRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Username is required");
                return ResponseEntity.badRequest().body(response);
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Password is required");
                return ResponseEntity.badRequest().body(response);
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setRole("CANDIDATE");

            boolean success = userService.register(user);
            
            if (success) {
                response.put("success", true);
                response.put("message", "Candidate registration successful!");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Sign up endpoint for Employers/Admins
     * POST /api/auth/signup/admin
     */
    @PostMapping("/api/auth/signup/admin")
    @ResponseBody
    public ResponseEntity<?> signupAdmin(@RequestBody SignupRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Username is required");
                return ResponseEntity.badRequest().body(response);
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Password is required");
                return ResponseEntity.badRequest().body(response);
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setRole("ADMIN");

            boolean success = userService.register(user);
            
            if (success) {
                response.put("success", true);
                response.put("message", "Employer registration successful!");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Login endpoint for Candidates
     * POST /api/auth/login/candidate
     */
    @PostMapping("/api/auth/login/candidate")
    @ResponseBody
    public ResponseEntity<?> loginCandidate(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = userService.authenticateCandidate(request.getUsername(), request.getPassword());
            
            if (success) {
                User user = userService.findByUsername(request.getUsername());
                response.put("success", true);
                response.put("message", "Login successful!");
                response.put("userId", user.getId());
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Login endpoint for Employers/Admins
     * POST /api/auth/login/admin
     */
    @PostMapping("/api/auth/login/admin")
    @ResponseBody
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = userService.authenticateAdmin(request.getUsername(), request.getPassword());
            
            if (success) {
                User user = userService.findByUsername(request.getUsername());
                response.put("success", true);
                response.put("message", "Login successful!");
                response.put("userId", user.getId());
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== REQUEST/RESPONSE CLASSES ====================

    public static class SignupRequest {
        private String username;
        private String password;
        private String email;
        private String phone;

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
