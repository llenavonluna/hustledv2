package com.example.hustled.dto;

import java.time.LocalDate;

/**
 * Data Transfer Object for Candidate Profile
 * Used for receiving profile updates from frontend
 */
public class CandidateProfileDTO {
    
    private Long userId;
    private String firstName;
    private String lastName;
    private String headline;
    private String bio;
    private String phone;
    private String city;
    private String province;
    private String postalCode;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private String portfolio;
    private String linkedin;
    private String github;
    private String website;
    
    // Constructors
    public CandidateProfileDTO() {}
    
    public CandidateProfileDTO(String firstName, String lastName, String headline, String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.headline = headline;
        this.bio = bio;
    }
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
    
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
