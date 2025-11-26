package com.example.hustled.controller;

import com.example.hustled.entity.Job;
import com.example.hustled.entity.User;
import com.example.hustled.repository.UserRepository;
import com.example.hustled.service.JobService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepo;

    public JobController(JobService jobService, UserRepository userRepo) {
        this.jobService = jobService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("jobs", jobService.findAll());
        return "jobs";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("job", new Job());
        model.addAttribute("action", "/jobs");
        return "job-form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("job") Job job,
                         BindingResult result,
                         Authentication auth,
                         Model model) {
        if (result.hasErrors()) {
            model.addAttribute("action", "/jobs");
            return "job-form";
        }
        User user = userRepo.findByUsername(auth.getName()).orElse(null);
        jobService.create(job, user);
        return "redirect:/jobs";
    }

    @GetMapping("/{id}")
    public String view(@PathVariable Long id, Model model) {
        Job job = jobService.findById(id);
        if (job == null) return "redirect:/jobs";
        model.addAttribute("job", job);
        return "job-view";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Job job = jobService.findById(id);
        if (job == null) return "redirect:/jobs";
        model.addAttribute("job", job);
        model.addAttribute("action", "/jobs/" + id);
        return "job-form";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("job") Job job,
                         BindingResult result,
                         Authentication auth,
                         Model model) {
        if (result.hasErrors()) {
            model.addAttribute("action", "/jobs/" + id);
            return "job-form";
        }
        User user = userRepo.findByUsername(auth.getName()).orElse(null);
        jobService.update(id, job, user);
        return "redirect:/jobs/" + id;
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        jobService.delete(id);
        return "redirect:/jobs";
    }

}
