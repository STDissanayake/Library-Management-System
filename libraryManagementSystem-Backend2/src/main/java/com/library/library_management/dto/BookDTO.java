package com.library.library_management.dto;

import java.time.LocalDate;

public class BookDTO {
    private Long id;
    private String title;
    private String isbn;
    private LocalDate publicationDate;
    private String category;
    private String status;
    private Integer totalCopies;
    private Integer availableCopies;
    private AuthorDTO author;
    private PublisherDTO publisher;

    // Constructors
    public BookDTO() {}

    public BookDTO(Long id, String title, String isbn, LocalDate publicationDate, String category, String status, Integer totalCopies, Integer availableCopies, AuthorDTO author, PublisherDTO publisher) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.publicationDate = publicationDate;
        this.category = category;
        this.status = status;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.author = author;
        this.publisher = publisher;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public LocalDate getPublicationDate() { return publicationDate; }
    public void setPublicationDate(LocalDate publicationDate) { this.publicationDate = publicationDate; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTotalCopies() { return totalCopies; }
    public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }

    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }

    public AuthorDTO getAuthor() { return author; }
    public void setAuthor(AuthorDTO author) { this.author = author; }

    public PublisherDTO getPublisher() { return publisher; }
    public void setPublisher(PublisherDTO publisher) { this.publisher = publisher; }
}
