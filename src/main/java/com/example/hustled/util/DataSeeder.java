package com.example.hustled.util;

import com.example.hustled.entity.Job;
import com.example.hustled.entity.User;
import com.example.hustled.repository.JobRepository;
import com.example.hustled.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JobRepository jobs;

    @Override
    public void run(String... args) {
//        if (users.count() == 0) {
//            User employer = new User();
//            employer.setEmail("employer@demo.com");
//            employer.setFullName("Demo Employer");
//            employer.setPassword(encoder.encode("Password123!"));
//            employer.setRole(UserRole.EMPLOYER);
//            users.save(employer);
//
//            User candidate = new User();
//            candidate.setEmail("candidate@demo.com");
//            candidate.setFullName("Demo Candidate");
//            candidate.setPassword(encoder.encode("Password123!"));
//            candidate.setRole(UserRole.CANDIDATE);
//            users.save(candidate);
//
//            Job job = new Job();
//            job.setTitle("Junior Java Developer");
//            job.setDescription("Build Spring Boot apps. Collaborate with team.");
//            job.setLocation("Quezon City, PH");
//            job.setEmploymentType("Full-time");
//            job.setEmployer(employer);
//            job.setActive(true);
//            jobs.save(job);
//        }
    }
}
