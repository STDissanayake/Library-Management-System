package lk.library.library_management_system.books.dto.BooksDTO;

import java.util.Set;

public class Bookssavedto {
    private String title;
    private String isbn;
    private String edition;
    private int publicationYear;
    private String language;

    private Long publisherId;       // Reference ID instead of entity
    private Set<Long> authorIds;    // Reference IDs
    private Set<Long> categoryIds;  // Reference IDs

    // Getters and Setters
}
