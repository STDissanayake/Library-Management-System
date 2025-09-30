package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.entities.Books;
import lk.library.library_management_system.books.service.Booksservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class Bookscon {

    private final Booksservice booksService;

    public Bookscon(Booksservice booksService) {
        this.booksService = booksService;
    }

    @GetMapping
    public List<Books> getAllBooks() {
        return booksService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Optional<Books> getBookById(@PathVariable Long id) {
        return booksService.getBookById(id);
    }

    @PostMapping
    public Books addBook(@RequestBody Books book) {
        return booksService.saveBook(book);
    }

    @PutMapping("/{id}")
    public Books updateBook(@PathVariable Long id, @RequestBody Books book) {
        book.setId(id);
        return booksService.saveBook(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        booksService.deleteBook(id);
    }
}
