package com.example.hustled.service;

import com.example.hustled.entity.Job;
import com.example.hustled.entity.User;
import com.example.hustled.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepo;

    public JobService(JobRepository jobRepo) {
        this.jobRepo = jobRepo;
    }

    public List<Job> findAll() {
        return jobRepo.findAll();
    }

    public Job findById(Long id) {
        return jobRepo.findById(id).orElse(null);
    }

    public Job create(Job job, User postedBy) {
        job.setPostedBy(postedBy);
        job.setCreatedAt(LocalDateTime.now());
        return jobRepo.save(job);
    }

    public Job update(Long id, Job updated, User postedBy) {
        Job existing = findById(id);
        if (existing == null) return null;
        existing.setTitle(updated.getTitle());
        existing.setCompany(updated.getCompany());
        existing.setLocation(updated.getLocation());
        existing.setDescription(updated.getDescription());
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setPostedBy(postedBy);
        return jobRepo.save(existing);
    }

    public void delete(Long id) {
        jobRepo.deleteById(id);
    }

}
