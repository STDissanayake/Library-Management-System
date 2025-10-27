package lk.library.library_management_system.books.dto.PublisherDTO;

public class Publisherdto {
    private Long publisherID;
    private String name;
    private Integer publishedYear;

    // Constructors
    public Publisherdto() {}

    public Publisherdto(Long publisherID, String name, Integer publishedYear) {
        this.publisherID = publisherID;
        this.name = name;
        this.publishedYear = publishedYear;
    }

    // Getters and Setters
    public Long getPublisherID() { return publisherID; }
    public void setPublisherID(Long publisherID) { this.publisherID = publisherID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }
}