package com.library.library_management.service;

import com.library.library_management.model.Book;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.AuthorRepository;
import com.library.library_management.repository.PublisherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;

    public BookService(BookRepository bookRepository, 
                      AuthorRepository authorRepository, 
                      PublisherRepository publisherRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book createBook(Book book) {
        // Ensure author and publisher exist
        if (book.getAuthor() != null && book.getAuthor().getId() != null) {
            book.setAuthor(authorRepository.findById(book.getAuthor().getId()).orElse(null));
        }
        if (book.getPublisher() != null && book.getPublisher().getId() != null) {
            book.setPublisher(publisherRepository.findById(book.getPublisher().getId()).orElse(null));
        }

        Integer total = book.getTotalCopies();
        Integer available = book.getAvailableCopies();
        if (total == null || total < 0) {
            total = 0;
        }
        if (available == null || available < 0) {
            available = total;
        }
        if (available > total) {
            available = total;
        }
        book.setTotalCopies(total);
        book.setAvailableCopies(available);

        String requestedStatus = book.getStatus();
        if (requestedStatus != null) {
            String normalized = requestedStatus.trim().toLowerCase();
            if ("unavailable".equals(normalized)) {
                book.setStatus("Unavailable");
                book.setAvailableCopies(0);
            } else if ("available".equals(normalized)) {
                book.setStatus("Available");
                if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
                    book.setAvailableCopies(book.getTotalCopies());
                }
            } else {
                // Preserve other statuses (e.g., Borrowed) if sent.
                book.setStatus(requestedStatus);
            }
        } else {
            book.setStatus(available > 0 ? "Available" : "Borrowed");
        }
        return bookRepository.save(book);
    }

    public Optional<Book> updateBook(Long id, Book bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            book.setIsbn(bookDetails.getIsbn());
            book.setPublicationDate(bookDetails.getPublicationDate());
            book.setCategory(bookDetails.getCategory());

            Integer total = bookDetails.getTotalCopies();
            Integer available = bookDetails.getAvailableCopies();
            if (total != null && total >= 0) {
                book.setTotalCopies(total);
                if (available == null) {
                    // Keep the existing availableCopies but clamp it.
                    available = book.getAvailableCopies();
                }
            }
            if (available != null && available >= 0) {
                book.setAvailableCopies(available);
            }

            // Clamp and derive status.
            Integer nextTotal = book.getTotalCopies() == null ? 0 : Math.max(0, book.getTotalCopies());
            Integer nextAvail = book.getAvailableCopies() == null ? nextTotal : Math.max(0, book.getAvailableCopies());
            if (nextAvail > nextTotal) {
                nextAvail = nextTotal;
            }
            book.setTotalCopies(nextTotal);
            book.setAvailableCopies(nextAvail);

            String requestedStatus = bookDetails.getStatus();
            if (requestedStatus != null) {
                String normalized = requestedStatus.trim().toLowerCase();
                if ("unavailable".equals(normalized)) {
                    book.setStatus("Unavailable");
                    book.setAvailableCopies(0);
                } else if ("available".equals(normalized)) {
                    book.setStatus("Available");
                    if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
                        book.setAvailableCopies(book.getTotalCopies());
                    }
                } else {
                    // Preserve other statuses (e.g., Borrowed) if needed by borrowing workflow.
                    book.setStatus(requestedStatus);
                }
            } else {
                // Backwards-compatible fallback.
                book.setStatus(nextAvail > 0 ? "Available" : "Borrowed");
            }
            
            if (bookDetails.getAuthor() != null && bookDetails.getAuthor().getId() != null) {
                book.setAuthor(authorRepository.findById(bookDetails.getAuthor().getId()).orElse(book.getAuthor()));
            }
            
            if (bookDetails.getPublisher() != null && bookDetails.getPublisher().getId() != null) {
                book.setPublisher(publisherRepository.findById(bookDetails.getPublisher().getId()).orElse(book.getPublisher()));
            }
            
            return bookRepository.save(book);
        });
    }

    public boolean deleteBook(Long id) {
        return bookRepository.findById(id).map(book -> {
            bookRepository.delete(book);
            return true;
        }).orElse(false);
    }

    public List<Book> searchBooks(String query) {
        return bookRepository.searchBooks(query);
    }

    public List<Book> quickSearch(String query, int limit) {
        List<Book> results = bookRepository.searchBooks(query);
        return results.stream().limit(limit).toList();
    }

    public List<Book> searchByTitle(String title) {
        return bookRepository.searchByTitle(title);
    }

    public List<Book> searchByAuthor(String author) {
        return bookRepository.searchByAuthor(author);
    }

    public List<Book> searchByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn).map(List::of).orElse(List.of());
    }

    public List<Book> searchByPublisher(String publisher) {
        return bookRepository.searchByPublisher(publisher);
    }

    public List<Book> filterByStatus(String status) {
        return bookRepository.findByStatus(status);
    }

    public List<Book> filterByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    public List<Book> filterBooks(String status, String category) {
        if (status != null && category != null) {
            return bookRepository.findByStatusAndCategory(status, category);
        } else if (status != null) {
            return filterByStatus(status);
        } else if (category != null) {
            return filterByCategory(category);
        } else {
            return getAllBooks();
        }
    }
}
