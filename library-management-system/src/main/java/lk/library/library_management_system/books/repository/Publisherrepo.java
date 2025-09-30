package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Publisherrepo extends JpaRepository<Publisher, Long> {
    Publisher findByName(String name); // Optional: find by name
}
