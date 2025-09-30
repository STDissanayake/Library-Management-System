package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface Booksrepo extends JpaRepository<Books, Long> {

    List<Books> findByTitleContainingIgnoreCase(String title);

    List<Books> findByAuthor_Name(String authorName);   // singular 'author'

    List<Books> findByCategories_Name(String categoryName);

    List<Books> findByPublisher_Name(String publisherName);
}
