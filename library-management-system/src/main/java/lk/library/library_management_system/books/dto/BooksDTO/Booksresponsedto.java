package lk.library.library_management_system.books.dto.BooksDTO;

public class Booksresponsedto {
    private Long bookID;
    private String title;
    private String isbn;
    private Integer publishedYear;  // Book's published year
    private String language;
    private String availability;
    private Integer copies;
    private String category;

    // Author fields
    private Long authorID;
    private String authorName;
    private String authorBio;

    // Publisher fields
    private Long publisherID;
    private String publisherName;  // Changed from 'name' to 'publisherName'
    private Integer publisherPublishedYear;  // Publisher's established year

    // Default Constructor
    public Booksresponsedto() {}

    // Getters and Setters - Book fields
    public Long getBookID() { return bookID; }
    public void setBookID(Long bookID) { this.bookID = bookID; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public Integer getCopies() { return copies; }
    public void setCopies(Integer copies) { this.copies = copies; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    // Author Getters and Setters
    public Long getAuthorID() { return authorID; }
    public void setAuthorID(Long authorID) { this.authorID = authorID; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorBio() { return authorBio; }
    public void setAuthorBio(String authorBio) { this.authorBio = authorBio; }

    // Publisher Getters and Setters
    public Long getPublisherID() { return publisherID; }
    public void setPublisherID(Long publisherID) { this.publisherID = publisherID; }

    public String getPublisherName() { return publisherName; }
    public void setPublisherName(String publisherName) { this.publisherName = publisherName; }

    public Integer getPublisherPublishedYear() { return publisherPublishedYear; }
    public void setPublisherPublishedYear(Integer publisherPublishedYear) { this.publisherPublishedYear = publisherPublishedYear; }

    @Override
    public String toString() {
        return "Booksresponsedto{" +
                "bookID=" + bookID +
                ", title='" + title + '\'' +
                ", isbn='" + isbn + '\'' +
                ", publishedYear=" + publishedYear +
                ", language='" + language + '\'' +
                ", availability='" + availability + '\'' +
                ", copies=" + copies +
                ", category='" + category + '\'' +
                ", authorID=" + authorID +
                ", authorName='" + authorName + '\'' +
                ", authorBio='" + authorBio + '\'' +
                ", publisherID=" + publisherID +
                ", publisherName='" + publisherName + '\'' +
                ", publisherPublishedYear=" + publisherPublishedYear +
                '}';
    }
}