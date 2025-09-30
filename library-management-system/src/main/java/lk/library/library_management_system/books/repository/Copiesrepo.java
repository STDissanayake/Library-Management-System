package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Copies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Copiesrepo extends JpaRepository<Copies, Long> {
    // Example: find copies by availability
    // List<BookCopy> findByAvailableTrue();
}
