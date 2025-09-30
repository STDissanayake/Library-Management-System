package lk.library.library_management_system.books.dto.AuthorDTO;

import java.util.Set;

public class Authorsavedto {
    private String name;
    private String bio; // changed from 'biography' to match AuthorDTO
    private String nationality;
    private Set<Long> bookIds; // only IDs, not full Book objects

    // No-arg constructor
    public Authorsavedto() {}

    // All-arg constructor
    public Authorsavedto(String name, String bio, String nationality, Set<Long> bookIds) {
        this.name = name;
        this.bio = bio;
        this.nationality = nationality;
        this.bookIds = bookIds;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public Set<Long> getBookIds() { return bookIds; }
    public void setBookIds(Set<Long> bookIds) { this.bookIds = bookIds; }

    @Override
    public String toString() {
        return "AuthorSaveDTO{" +
                "name='" + name + '\'' +
                ", bio='" + bio + '\'' +
                ", nationality='" + nationality + '\'' +
                ", bookIds=" + bookIds +
                '}';
    }
}
