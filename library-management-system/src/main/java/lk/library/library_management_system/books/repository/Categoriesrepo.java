package lk.library.library_management_system.books.repository;

import lk.library.library_management_system.books.entities.Categories;
import lk.library.library_management_system.books.entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Categoriesrepo extends JpaRepository<Categories, Long> {
    Optional<Categories> findByName(String name);
}
