package lk.library.library_management_system.books.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "author")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "author_ID")
    private Long authorID;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "bio")
    private String bio;

    // Constructors
    public Author() {}

    public Author(String authorName, String bio) {
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

    // toString method for debugging
    @Override
    public String toString() {
        return "Author{" +
                "authorID=" + authorID +
                ", authorName='" + authorName + '\'' +
                ", bio='" + bio + '\'' +
                '}';
    }
}