package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.dto.AuthorDTO.Authorresponsedto;
import lk.library.library_management_system.books.dto.AuthorDTO.Authorsavedto;
import lk.library.library_management_system.books.dto.AuthorDTO.Authorupdatedto;
import lk.library.library_management_system.books.service.Authorservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/authors")
public class Authorcon {

    @Autowired
    private Authorservice authorService;

    @GetMapping("/count")
    public ResponseEntity<Long> getAuthorsCount() {
        Long count = authorService.getAuthorsCount();
        return ResponseEntity.ok(count);
    }

    // TODO: Remove or comment out this endpoint until repository is fixed
    /*
    @GetMapping("/{id}/books/count")
    public ResponseEntity<Long> getBooksCountByAuthor(@PathVariable Long id) {
        Long count = booksService.getBooksCountByAuthor(id);
        return ResponseEntity.ok(count);
    }
    */

    @GetMapping
    public ResponseEntity<List<Authorresponsedto>> getAllAuthors() {
        List<Authorresponsedto> authors = authorService.getAllAuthors();
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Authorresponsedto> getAuthorById(@PathVariable Long id) {
        Authorresponsedto author = authorService.getAuthorById(id);
        return ResponseEntity.ok(author);
    }

    @PostMapping
    public ResponseEntity<Authorresponsedto> createAuthor(@RequestBody Authorsavedto authorSaveDTO) {
        Authorresponsedto createdAuthor = authorService.createAuthor(authorSaveDTO);
        return new ResponseEntity<>(createdAuthor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Authorresponsedto> updateAuthor(@PathVariable Long id, @RequestBody Authorupdatedto authorUpdateDTO) {
        Authorresponsedto updatedAuthor = authorService.updateAuthor(id, authorUpdateDTO);
        return ResponseEntity.ok(updatedAuthor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }
}