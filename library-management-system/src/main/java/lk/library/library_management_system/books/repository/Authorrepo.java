package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Authorrepo extends JpaRepository<Author, Long> {
    Optional<Author> findByAuthorName(String authorName);
    boolean existsByAuthorName(String authorName);
}
