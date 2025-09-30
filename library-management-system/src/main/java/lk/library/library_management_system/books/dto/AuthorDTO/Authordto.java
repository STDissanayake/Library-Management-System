package lk.library.library_management_system.books.dto.AuthorDTO;

import java.util.Set;

public class Authordto {
    private Long id;
    private String name;
    private String bio;
    private String nationality; // ADD THIS MISSING FIELD
    private Set<String> books;

    // No-arg constructor
    public Authordto() {}

    // Updated All-arg constructor
    public Authordto(Long id, String name, String bio, String nationality, Set<String> books) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.nationality = nationality; // ADD THIS
        this.books = books;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    // ADD GETTER/SETTER FOR NATIONALITY
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public Set<String> getBooks() { return books; }
    public void setBooks(Set<String> books) { this.books = books; }

    @Override
    public String toString() {
        return "AuthorDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", bio='" + bio + '\'' +
                ", nationality='" + nationality + '\'' + // ADD THIS
                ", books=" + books +
                '}';
    }
}