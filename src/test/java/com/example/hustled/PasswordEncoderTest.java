package com.example.hustled;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Scanner;

public class PasswordEncoderTest {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("Enter password: ");
        String rawPassword = scanner.next();
        String encodedPassword = encoder.encode(rawPassword);

        System.out.println("Raw: " + rawPassword);
        System.out.println("Encoded: " + encodedPassword);
    }
}
