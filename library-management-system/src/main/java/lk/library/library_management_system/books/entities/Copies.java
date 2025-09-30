package lk.library.library_management_system.books.entities;

import jakarta.persistence.*;

@Entity
public class Copies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;
    private String status;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Books book;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Books getBook() { return book; }
    public void setBook(Books book) { this.book = book; }
}
