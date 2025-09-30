package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.entities.Books;
import lk.library.library_management_system.books.repository.Booksrepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Booksservice {

    private final Booksrepo booksrepo;

    // Constructor name matches class name
    public Booksservice(Booksrepo booksrepo) {
        this.booksrepo = booksrepo;
    }

    // Business logic methods
    public List<Books> getAllBooks() {
        return booksrepo.findAll();
    }

    public Optional<Books> getBookById(Long id) {
        return booksrepo.findById(id);
    }

    public Books saveBook(Books book) {
        return booksrepo.save(book);
    }

    public void deleteBook(Long id) {
        booksrepo.deleteById(id);
    }

    public List<Books> searchByTitle(String title) {
        return booksrepo.findByTitleContainingIgnoreCase(title);
    }
}
