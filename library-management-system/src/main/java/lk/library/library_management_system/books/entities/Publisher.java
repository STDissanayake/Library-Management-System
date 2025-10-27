package lk.library.library_management_system.books.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "publisher")
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "publisher_ID")
    private Long publisherID;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "published_year", nullable = false)
    private Integer publishedYear;

    // Constructors
    public Publisher() {}

    public Publisher(String name, Integer publishedYear) {
        this.name = name;
        this.publishedYear = publishedYear;
    }

    // Getters and Setters
    public Long getPublisherID() {
        return publisherID;
    }

    public void setPublisherID(Long publisherID) {
        this.publisherID = publisherID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }
}