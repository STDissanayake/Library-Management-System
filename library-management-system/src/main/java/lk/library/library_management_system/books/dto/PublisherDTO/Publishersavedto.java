package lk.library.library_management_system.books.dto.PublisherDTO;

public class Publishersavedto {
    private String name;
    private Integer publishedYear;

    public Publishersavedto() {}

    public Publishersavedto(String name, Integer publishedYear) {
        this.name = name;
        this.publishedYear = publishedYear;
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