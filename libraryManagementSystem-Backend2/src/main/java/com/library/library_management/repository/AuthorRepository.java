package com.library.library_management.repository;

import com.library.library_management.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    Optional<Author> findByName(String name);

    @Query("SELECT a FROM Author a WHERE " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.bio) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.nationality) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Author> searchAuthors(@Param("query") String query);

    @Query("SELECT COUNT(a) FROM Author a")
    Long countTotalAuthors();
}
