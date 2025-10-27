package lk.library.library_management_system.books.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_ID")
    private Long bookID;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "isbn", nullable = false, unique = true)
    private String isbn;

    @Column(name = "published_year", nullable = false)
    private Integer publishedYear;

    @Column(name = "language")
    private String language = "English";

    @Column(name = "availability")
    private String availability = "Available";

    @Column(name = "copies")
    private Integer copies = 1;

    @Column(name = "category")
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_ID")
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_ID")
    private Publisher publisher;

    // Default Constructor
    public Books() {}

    // Full Constructor
    public Books(String title, String isbn, Integer publishedYear, String language,
                 String availability, Integer copies, String category,
                 Author author, Publisher publisher) {
        this.title = title;
        this.isbn = isbn;
        this.publishedYear = publishedYear;
        this.language = language;
        this.availability = availability;
        this.copies = copies;
        this.category = category;
        this.author = author;
        this.publisher = publisher;
    }

    // Minimal Constructor
    public Books(String title, String isbn, Integer publishedYear) {
        this.title = title;
        this.isbn = isbn;
        this.publishedYear = publishedYear;
    }

    // Getters and Setters
    public Long getBookID() {
        return bookID;
    }

    public void setBookID(Long bookID) {
        this.bookID = bookID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Integer getCopies() {
        return copies;
    }

    public void setCopies(Integer copies) {
        this.copies = copies;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "Books{" +
                "bookID=" + bookID +
                ", title='" + title + '\'' +
                ", isbn='" + isbn + '\'' +
                ", publishedYear=" + publishedYear +
                ", language='" + language + '\'' +
                ", availability='" + availability + '\'' +
                ", copies=" + copies +
                ", category='" + category + '\'' +
                ", author=" + (author != null ? author.getAuthorName() : "null") +
                ", publisher=" + (publisher != null ? publisher.getName() : "null") +
                '}';
    }
}