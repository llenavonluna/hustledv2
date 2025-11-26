package com.example.hustled.config;

import com.example.hustled.service.CustomUserDetailsService;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public DaoAuthenticationProvider authProvider(CustomUserDetailsService userDetailsService,
                                                  BCryptPasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Jobzilla subfolder - all public (includes register.html at /jobzilla/jobzilla/register.html)
                        .requestMatchers("/jobzilla/**").permitAll()
                        // Public endpoints and pages
                        .requestMatchers("/", "/index", "/index.html", "/login", "/login.html", "/register", "/register.html", 
                                        "/about-1.html", "/contact.html", "/coming-soon.html", "/job-list.html", "/job-grid.html",
                                        "/job-detail.html", "/job-detail-v2.html", "/employer-list.html", "/employer-grid.html",
                                        "/employer-detail.html", "/employer-detail-v2.html", "/candidate-list.html", "/candidate-grid.html",
                                        "/candidate-detail.html", "/faq.html", "/pricing.html", "/icons.html",
                                        "/modal/register", "/process-register").permitAll()
                        // API endpoints - no authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        // Static resources
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/fonts/**", "/files/**", "/phpmailer/**", "/webjars/**").permitAll()
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/process-login")
                        .defaultSuccessUrl("/jobs", true)
                        .failureUrl("/login?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/index")
                        .permitAll()
                )
                .httpBasic(AbstractHttpConfigurer::disable); // Disable HTTP Basic Auth
        return http.build();
    }

}
