package com.library_management_system.Library.Management.System.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Books") // match the table name exactly as in MySQL
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_ID") // link to your existing column
    private Integer bookId;

    private String title;

    // Temporarily keeping this as String to match current frontend or simple setup
    private String author;

    private String isbn;

    // Change to match your database — ENUM('Available', 'Not Available')
    private String availability = "Available";

    public Book() {}

    public Book(Integer bookId, String title, String author, String availability) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.availability = availability;
    }

    // Getters and setters
    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    @Override
    public String toString() {
        return "Book{" +
                "bookId=" + bookId +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", availability='" + availability + '\'' +
                '}';
    }
}
