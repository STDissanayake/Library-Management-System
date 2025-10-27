package lk.library.library_management_system.books.dto.AuthorDTO;

public class Authorsavedto {
    private String authorName;
    private String bio;

    // Default Constructor
    public Authorsavedto() {}

    // Parameterized Constructor
    public Authorsavedto(String authorName, String bio) {
        this.authorName = authorName;
        this.bio = bio;
    }

    // Getters and Setters
    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}