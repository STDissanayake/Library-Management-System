package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.dto.BooksDTO.Booksresponsedto;
import lk.library.library_management_system.books.dto.BooksDTO.Bookssavedto;
import lk.library.library_management_system.books.dto.BooksDTO.Booksupdatedto;
import lk.library.library_management_system.books.entities.Author;
import lk.library.library_management_system.books.entities.Books;
import lk.library.library_management_system.books.entities.Publisher;
import lk.library.library_management_system.books.exception.AuthorNotFoundException;
import lk.library.library_management_system.books.exception.BookNotFoundException;
import lk.library.library_management_system.books.exception.PublisherNotFoundException;
import lk.library.library_management_system.books.repository.Authorrepo;
import lk.library.library_management_system.books.repository.Booksrepo;
import lk.library.library_management_system.books.repository.Publisherrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class Booksservice {

    @Autowired
    private Booksrepo booksRepository;

    @Autowired
    private Authorrepo authorRepository;

    @Autowired
    private Publisherrepo publisherRepository;

    // For REST API (returns DTOs)
    @Transactional(readOnly = true)
    public List<Booksresponsedto> getAllBooks() {
        return booksRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // For Thymeleaf (returns Entities)
    @Transactional(readOnly = true)
    public List<Books> getAllBooksForView() {
        return booksRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Booksresponsedto getBookById(Long id) {
        Books book = booksRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return convertToResponseDTO(book);
    }

    @Transactional
    public Booksresponsedto createBook(Bookssavedto booksSaveDTO) {
        System.out.println("📖 Creating book with author ID: " + booksSaveDTO.getAuthorID() +
                ", publisher ID: " + booksSaveDTO.getPublisherID() +
                ", copies: " + booksSaveDTO.getCopies() +
                ", requested availability: " + booksSaveDTO.getAvailability());

        Author author = authorRepository.findById(booksSaveDTO.getAuthorID())
                .orElseThrow(() -> new AuthorNotFoundException("Author not found with id: " + booksSaveDTO.getAuthorID()));

        Publisher publisher = publisherRepository.findById(booksSaveDTO.getPublisherID())
                .orElseThrow(() -> new PublisherNotFoundException("Publisher not found with id: " + booksSaveDTO.getPublisherID()));

        Books book = new Books();
        book.setTitle(booksSaveDTO.getTitle());
        book.setIsbn(booksSaveDTO.getIsbn());
        book.setPublishedYear(booksSaveDTO.getPublishedYear());
        book.setLanguage(booksSaveDTO.getLanguage());
        book.setCategory(booksSaveDTO.getCategory());
        book.setAuthor(author);
        book.setPublisher(publisher);

        // SMART availability handling
        Integer copies = booksSaveDTO.getCopies() != null ? booksSaveDTO.getCopies() : 1;
        book.setCopies(copies);

        String requestedAvailability = booksSaveDTO.getAvailability();
        if (copies <= 0) {
            // Force "Not Available" if copies is 0 (data consistency)
            book.setAvailability("Not Available");
            System.out.println("🔒 Copies=0, forcing availability to: Not Available");
        } else {
            // Allow manual selection when copies > 0
            book.setAvailability(requestedAvailability != null ? requestedAvailability : "Available");
            System.out.println("✅ Using manually selected availability: " + book.getAvailability());
        }

        System.out.println("📦 Final book data - copies: " + book.getCopies() + ", availability: " + book.getAvailability());

        Books savedBook = booksRepository.save(book);
        return convertToResponseDTO(savedBook);
    }

    @Transactional
    public Booksresponsedto updateBook(Long id, Booksupdatedto booksUpdateDTO) {
        Books book = booksRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

        System.out.println("🔄 Updating book ID: " + id +
                ", requested copies: " + booksUpdateDTO.getCopies() +
                ", requested availability: " + booksUpdateDTO.getAvailability());

        Author author = authorRepository.findById(booksUpdateDTO.getAuthorID())
                .orElseThrow(() -> new AuthorNotFoundException("Author not found with id: " + booksUpdateDTO.getAuthorID()));

        Publisher publisher = publisherRepository.findById(booksUpdateDTO.getPublisherID())
                .orElseThrow(() -> new PublisherNotFoundException("Publisher not found with id: " + booksUpdateDTO.getPublisherID()));

        book.setTitle(booksUpdateDTO.getTitle());
        book.setIsbn(booksUpdateDTO.getIsbn());
        book.setPublishedYear(booksUpdateDTO.getPublishedYear());
        book.setLanguage(booksUpdateDTO.getLanguage());
        book.setCategory(booksUpdateDTO.getCategory());
        book.setAuthor(author);
        book.setPublisher(publisher);

        // SMART availability handling for update
        Integer copies = booksUpdateDTO.getCopies() != null ? booksUpdateDTO.getCopies() : book.getCopies();
        book.setCopies(copies);

        String requestedAvailability = booksUpdateDTO.getAvailability();
        if (copies <= 0) {
            // Force "Not Available" if copies is 0 (data consistency)
            book.setAvailability("Not Available");
            System.out.println("🔒 Copies=0, forcing availability to: Not Available");
        } else {
            // Allow manual selection when copies > 0
            book.setAvailability(requestedAvailability != null ? requestedAvailability : "Available");
            System.out.println("✅ Using manually selected availability: " + book.getAvailability());
        }

        System.out.println("📦 Final updated data - copies: " + book.getCopies() + ", availability: " + book.getAvailability());

        Books updatedBook = booksRepository.save(book);
        return convertToResponseDTO(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!booksRepository.existsById(id)) {
            throw new BookNotFoundException("Book not found with id: " + id);
        }
        booksRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Booksresponsedto> searchBooksByTitle(String title) {
        return booksRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Add this method for quick search
    @Transactional(readOnly = true)
    public List<Booksresponsedto> quickSearchBooks(String query, int limit) {
        List<Books> books = booksRepository.quickSearch(query);

        // Apply limit and convert to DTO
        return books.stream()
                .limit(limit)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Long getBooksCount() {
        return booksRepository.count();
    }

    // TODO: Add these back when repository is fixed
    /*
    @Transactional(readOnly = true)
    public Long getBooksCountByPublisher(Long publisherId) {
        return booksRepository.countByPublisherId(publisherId);
    }

    @Transactional(readOnly = true)
    public Long getBooksCountByAuthor(Long authorId) {
        return booksRepository.countByAuthorId(authorId);
    }
    */

    @Transactional(readOnly = true)
    public List<Booksresponsedto> filterBooks(String title, String status) {
        List<Books> books;

        if (title != null && !title.trim().isEmpty()) {
            books = booksRepository.findByTitleContainingIgnoreCase(title);
        } else {
            books = booksRepository.findAll();
        }

        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private Booksresponsedto convertToResponseDTO(Books book) {
        Booksresponsedto dto = new Booksresponsedto();
        dto.setBookID(book.getBookID());
        dto.setTitle(book.getTitle());
        dto.setIsbn(book.getIsbn());
        dto.setPublishedYear(book.getPublishedYear());
        dto.setLanguage(book.getLanguage());
        dto.setAvailability(book.getAvailability());
        dto.setCopies(book.getCopies());
        dto.setCategory(book.getCategory());

        if (book.getAuthor() != null) {
            dto.setAuthorID(book.getAuthor().getAuthorID());
            dto.setAuthorName(book.getAuthor().getAuthorName());
            dto.setAuthorBio(book.getAuthor().getBio());
        } else {
            dto.setAuthorName("Unknown Author");
        }

        if (book.getPublisher() != null) {
            dto.setPublisherID(book.getPublisher().getPublisherID());
            dto.setPublisherName(book.getPublisher().getName());
            dto.setPublisherPublishedYear(book.getPublisher().getPublishedYear());
        } else {
            dto.setPublisherName("Unknown Publisher");
        }

        return dto;
    }
}