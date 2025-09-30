package lk.library.library_management_system.books.dto.BooksDTO;
import java.util.Set;

public class Booksdto {
    private Long id;
    private String title;
    private String isbn;
    private String edition;
    private int publicationYear;
    private String language;

    private String publisherName;   // Just the name, not the whole Publisher entity
    private Set<String> authorNames; // Just names
    private Set<String> categoryNames; // Just names
    private int availableCopies; // Number of copies (instead of exposing entity)

    // Getters and Setters
}
