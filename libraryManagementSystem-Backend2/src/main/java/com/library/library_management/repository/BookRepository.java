package com.library.library_management.repository;

import com.library.library_management.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Search methods
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.publisher.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> searchByTitle(@Param("title") String title);

    @Query("SELECT b FROM Book b WHERE LOWER(b.author.name) LIKE LOWER(CONCAT('%', :author, '%'))")
    List<Book> searchByAuthor(@Param("author") String author);

    @Query("SELECT b FROM Book b WHERE b.isbn = :isbn")
    Optional<Book> findByIsbn(@Param("isbn") String isbn);

    @Query("SELECT b FROM Book b WHERE LOWER(b.publisher.name) LIKE LOWER(CONCAT('%', :publisher, '%'))")
    List<Book> searchByPublisher(@Param("publisher") String publisher);

    // Filter methods
    List<Book> findByStatus(String status);
    
    List<Book> findByCategory(String category);

    @Query("SELECT b FROM Book b WHERE b.status = :status AND b.category = :category")
    List<Book> findByStatusAndCategory(@Param("status") String status, @Param("category") String category);

    @Query("SELECT COUNT(b) FROM Book b")
    Long countTotalBooks();

    @Query("SELECT COUNT(b) FROM Book b WHERE b.status = :status")
    Long countByStatus(@Param("status") String status);
}
