package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Booksrepo extends JpaRepository<Books, Long> {
    List<Books> findByTitleContainingIgnoreCase(String title);

    // Add this method for quick search
    @Query("SELECT b FROM Books b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.author.authorName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.publisher.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Books> quickSearch(@Param("query") String query);

    // Remove custom queries temporarily
    // @Query("SELECT COUNT(b) FROM Books b WHERE b.publisher.publisherID = :publisherId")
    // Long countByPublisherId(@Param("publisherId") Long publisherId);

    // @Query("SELECT COUNT(b) FROM Books b WHERE b.author.authorID = :authorId")
    // Long countByAuthorId(@Param("authorId") Long authorId);
}