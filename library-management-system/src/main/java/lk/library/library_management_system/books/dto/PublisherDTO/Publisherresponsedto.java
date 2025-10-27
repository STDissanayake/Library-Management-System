package lk.library.library_management_system.books.dto.PublisherDTO;

public class Publisherresponsedto {
    private Long publisherID;
    private String name;
    private Integer publishedYear;

    public Publisherresponsedto() {}

    public Publisherresponsedto(Long publisherID, String name, Integer publishedYear) {
        this.publisherID = publisherID;
        this.name = name;
        this.publishedYear = publishedYear;
    }

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