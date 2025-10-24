package com.library_management_system.Library.Management.System.repo;

import com.library_management_system.Library.Management.System.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepo extends JpaRepository<Book, Integer> {
}