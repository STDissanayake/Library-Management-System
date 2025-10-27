package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Booksrepo extends JpaRepository<Books, Long> {
    List<Books> findByTitleContainingIgnoreCase(String title);

    // Remove custom queries temporarily
    // @Query("SELECT COUNT(b) FROM Books b WHERE b.publisher.publisherID = :publisherId")
    // Long countByPublisherId(@Param("publisherId") Long publisherId);

    // @Query("SELECT COUNT(b) FROM Books b WHERE b.author.authorID = :authorId")
    // Long countByAuthorId(@Param("authorId") Long authorId);
}