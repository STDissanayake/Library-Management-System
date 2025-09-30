package lk.library.library_management_system.books.dto.BooksDTO;

import java.util.Set;

public class Booksupdatedto {
    private Long id;                // Required for update
    private String title;
    private String isbn;
    private String edition;
    private int publicationYear;
    private String language;

    private Long publisherId;
    private Set<Long> authorIds;
    private Set<Long> categoryIds;

    // Getters and Setters
}
