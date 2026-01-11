package com.library.library_management.controller;

import com.library.library_management.dto.BookDTO;
import com.library.library_management.model.Book;
import com.library.library_management.service.BookService;
import com.library.library_management.mapper.BookMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;
    private final BookMapper bookMapper;

    public BookController(BookService bookService, BookMapper bookMapper) {
        this.bookService = bookService;
        this.bookMapper = bookMapper;
    }

    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(b -> ResponseEntity.ok(bookMapper.toDTO(b)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO bookDTO) {
        Book book = bookMapper.toEntity(bookDTO);
        Book savedBook = bookService.createBook(book);
        return ResponseEntity.ok(bookMapper.toDTO(savedBook));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        Book book = bookMapper.toEntity(bookDTO);
        Optional<Book> updatedBook = bookService.updateBook(id, book);
        return updatedBook.map(b -> ResponseEntity.ok(bookMapper.toDTO(b)))
                         .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam String query) {
        List<Book> books = bookService.searchBooks(query);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/search/quick")
    public ResponseEntity<List<BookDTO>> quickSearch(@RequestParam String query, @RequestParam(defaultValue = "10") int limit) {
        List<Book> books = bookService.quickSearch(query, limit);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<BookDTO>> searchByTitle(@RequestParam String title) {
        List<Book> books = bookService.searchByTitle(title);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/search/author")
    public ResponseEntity<List<BookDTO>> searchByAuthor(@RequestParam String author) {
        List<Book> books = bookService.searchByAuthor(author);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/search/isbn")
    public ResponseEntity<List<BookDTO>> searchByIsbn(@RequestParam String isbn) {
        List<Book> books = bookService.searchByIsbn(isbn);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/search/publisher")
    public ResponseEntity<List<BookDTO>> searchByPublisher(@RequestParam String publisher) {
        List<Book> books = bookService.searchByPublisher(publisher);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/filter/status")
    public ResponseEntity<List<BookDTO>> filterByStatus(@RequestParam String status) {
        List<Book> books = bookService.filterByStatus(status);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/filter/category")
    public ResponseEntity<List<BookDTO>> filterByCategory(@RequestParam String category) {
        List<Book> books = bookService.filterByCategory(category);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<BookDTO>> filterBooks(@RequestParam(required = false) String status,
                                                 @RequestParam(required = false) String category) {
        List<Book> books = bookService.filterBooks(status, category);
        List<BookDTO> bookDTOs = books.stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookDTOs);
    }
}
