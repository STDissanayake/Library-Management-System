package lk.library.library_management_system.books.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Publisher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Books> books = new HashSet<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Set<Books> getBooks() { return books; }
    public void setBooks(Set<Books> books) { this.books = books; }

    // Helper methods for bidirectional mapping
    public void addBook(Books book) {
        books.add(book);
        book.setPublisher(this);
    }

    public void removeBook(Books book) {
        books.remove(book);
        book.setPublisher(null);
    }
}
