package lk.library.library_management_system.books.dto.CategoriesDTO;

import java.util.Set;

public class Categoriesdto {

        private Long id;
        private String name;
        private String description;

        private Set<String> bookTitles; // optional: list of book titles under this category

        // Getters and Setters
    }
