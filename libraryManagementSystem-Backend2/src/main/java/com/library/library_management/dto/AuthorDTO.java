package com.library.library_management.dto;

public class AuthorDTO {
    private Long id;
    private String name;
    private String bio;
    private String nationality;

    // Constructors
    public AuthorDTO() {}

    public AuthorDTO(Long id, String name, String bio, String nationality) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.nationality = nationality;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
}
