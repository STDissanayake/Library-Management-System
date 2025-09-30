package lk.library.library_management_system.books.dto.PublisherDTO;

import java.util.Set;

public class Publisherdto {
    private Long id;
    private String name;
    private String address;
    private String contactEmail;
    private String contactPhone;

    private Set<String> bookTitles; // optional: list of books published by this publisher

    // Getters and Setters
}
