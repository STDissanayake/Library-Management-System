package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.dto.BooksDTO.Booksresponsedto;
import lk.library.library_management_system.books.dto.BooksDTO.Bookssavedto;
import lk.library.library_management_system.books.dto.BooksDTO.Booksupdatedto;
import lk.library.library_management_system.books.service.Booksservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class Bookscon {

    @Autowired
    private Booksservice booksService;

    @GetMapping
    public ResponseEntity<List<Booksresponsedto>> getAllBooks() {
        List<Booksresponsedto> books = booksService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booksresponsedto> getBookById(@PathVariable Long id) {
        Booksresponsedto book = booksService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    @PostMapping
    public ResponseEntity<Booksresponsedto> createBook(@RequestBody Bookssavedto booksSaveDTO) {
        Booksresponsedto createdBook = booksService.createBook(booksSaveDTO);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booksresponsedto> updateBook(@PathVariable Long id, @RequestBody Booksupdatedto booksUpdateDTO) {
        Booksresponsedto updatedBook = booksService.updateBook(id, booksUpdateDTO);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        booksService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Booksresponsedto>> searchBooksByTitle(@RequestParam String title) {
        List<Booksresponsedto> books = booksService.searchBooksByTitle(title);
        return ResponseEntity.ok(books);
    }

    // Add this endpoint for quick search
    @GetMapping("/search/quick")
    public ResponseEntity<List<Booksresponsedto>> quickSearchBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Booksresponsedto> books = booksService.quickSearchBooks(query, limit);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getBooksCount() {
        Long count = booksService.getBooksCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Booksresponsedto>> filterBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status) {
        List<Booksresponsedto> books = booksService.filterBooks(title, status);
        return ResponseEntity.ok(books);
    }
}