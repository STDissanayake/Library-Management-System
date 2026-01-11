package com.library.library_management.repository;

import com.library.library_management.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    Optional<Publisher> findByName(String name);

    @Query("SELECT p FROM Publisher p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.contactInfo) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Publisher> searchPublishers(@Param("query") String query);

    @Query("SELECT COUNT(p) FROM Publisher p")
    Long countTotalPublishers();
}
