package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Publisherrepo extends JpaRepository<Publisher, Long> {
    Optional<Publisher> findByName(String name);
    boolean existsByName(String name);
}