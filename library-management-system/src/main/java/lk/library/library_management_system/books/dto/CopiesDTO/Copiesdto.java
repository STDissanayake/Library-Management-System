package lk.library.library_management_system.books.dto.CopiesDTO;

public class Copiesdto {

        private Long id;
        private String status;   // e.g. AVAILABLE, BORROWED, RESERVED
        private String location; // shelf/location info
        private String bookTitle; // reference to book (instead of whole entity)

        // Getters and Setters
    }

