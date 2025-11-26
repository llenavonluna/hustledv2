package com.example.hustled.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @Column(nullable = false)
    @NotBlank @Size(min = 6, max = 100)
    private String password;

    @Column(nullable = false)
    @Email @NotBlank
    private String email;

    private String phone;

    @Column(nullable = false)
    private String role = "USER";
}
