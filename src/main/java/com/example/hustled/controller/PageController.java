package com.example.hustled.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    
    @GetMapping("/register.html")
    public String registerPage() {
        return "redirect:/jobzilla/jobzilla/register.html";
    }
    
}
