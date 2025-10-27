package lk.library.library_management_system.books.dto.AuthorDTO;

public class Authorresponsedto {
    private Long authorID;
    private String authorName;
    private String bio;

    // Default Constructor
    public Authorresponsedto() {}

    // Parameterized Constructor
    public Authorresponsedto(Long authorID, String authorName, String bio) {
        this.authorID = authorID;
        this.authorName = authorName;
        this.bio = bio;
    }

    // Getters and Setters
    public Long getAuthorID() {
        return authorID;
    }

    public void setAuthorID(Long authorID) {
        this.authorID = authorID;
    }

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