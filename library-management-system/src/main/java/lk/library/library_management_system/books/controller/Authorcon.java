package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.dto.AuthorDTO.Authordto;
import lk.library.library_management_system.books.dto.AuthorDTO.Authorsavedto;
import lk.library.library_management_system.books.service.Authorservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class Authorcon {

    private final Authorservice authorService;

    public Authorcon(Authorservice authorService) {
        this.authorService = authorService;
    }

    // Get all authors
    @GetMapping
    public List<Authordto> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    // Get author by ID
    @GetMapping("/{id}")
    public Authordto getAuthorById(@PathVariable Long id) {
        return authorService.getAuthorById(id);
    }

    // Add a new author
    @PostMapping
    public Authordto addAuthor(@RequestBody Authorsavedto authorSaveDTO) {
        return authorService.saveAuthor(authorSaveDTO);
    }

    // Update an existing author
    @PutMapping("/{id}")
    public Authordto updateAuthor(@PathVariable Long id, @RequestBody Authorsavedto authorSaveDTO) {
        return authorService.updateAuthor(id, authorSaveDTO);
    }

    // Delete author by ID
    @DeleteMapping("/{id}")
    public void deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
    }
}
