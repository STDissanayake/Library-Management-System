package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.dto.AuthorDTO.Authordto;
import lk.library.library_management_system.books.dto.AuthorDTO.Authorsavedto;
import lk.library.library_management_system.books.entities.Author;
import lk.library.library_management_system.books.entities.Books;
import lk.library.library_management_system.books.exception.AuthorNotFoundException;
import lk.library.library_management_system.books.exception.BookNotFoundException;
import lk.library.library_management_system.books.repository.Authorrepo;
import lk.library.library_management_system.books.repository.Booksrepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class Authorservice {

    private final Authorrepo authorRepository;
    private final Booksrepo bookRepository;

    public Authorservice(Authorrepo authorRepository, Booksrepo bookRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
    }

    // Get all authors
    public List<Authordto> getAllAuthors() {
        return authorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get author by ID
    public Authordto getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException(id));
        return convertToDTO(author);
    }

    // Add a new author
    public Authordto saveAuthor(Authorsavedto dto) {
        Author author = new Author();
        author.setName(dto.getName());
        author.setBio(dto.getBio());
        author.setNationality(dto.getNationality()); // ADDED

        if (dto.getBookIds() != null && !dto.getBookIds().isEmpty()) {
            Set<Books> books = dto.getBookIds()
                    .stream()
                    .map(bookId -> bookRepository.findById(bookId)
                            .orElseThrow(() -> new BookNotFoundException(bookId)))
                    .collect(Collectors.toSet());
            books.forEach(author::addBook);
        }

        Author saved = authorRepository.save(author);
        return convertToDTO(saved);
    }

    // Update an existing author
    public Authordto updateAuthor(Long id, Authorsavedto dto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException(id));

        author.setName(dto.getName());
        author.setBio(dto.getBio());
        author.setNationality(dto.getNationality()); // ADDED

        author.getBooks().clear();
        if (dto.getBookIds() != null && !dto.getBookIds().isEmpty()) {
            Set<Books> books = dto.getBookIds()
                    .stream()
                    .map(bookId -> bookRepository.findById(bookId)
                            .orElseThrow(() -> new BookNotFoundException(bookId)))
                    .collect(Collectors.toSet());
            books.forEach(author::addBook);
        }

        Author updated = authorRepository.save(author);
        return convertToDTO(updated);
    }

    // Delete author by ID
    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new AuthorNotFoundException(id);
        }
        authorRepository.deleteById(id);
    }

    // Convert Author entity → Authordto
    private Authordto convertToDTO(Author author) {
        Set<String> bookTitles = author.getBooks()
                .stream()
                .map(Books::getTitle)
                .collect(Collectors.toSet());

        return new Authordto(
                author.getId(),
                author.getName(),
                author.getBio(),
                author.getNationality(), // ADDED
                bookTitles
        );
    }
}