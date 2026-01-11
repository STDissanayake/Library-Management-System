package com.library.library_management.repository;

import com.library.library_management.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // Find by email
    Optional<Member> findByEmail(String email);

    // Search members by name
    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Member> searchMembers(@Param("query") String query);

    // Find by status
    List<Member> findByStatus(String status);

    // Count total members
    @Query("SELECT COUNT(m) FROM Member m")
    Long countTotalMembers();

    // Count members by status
    @Query("SELECT COUNT(m) FROM Member m WHERE m.status = :status")
    Long countByStatus(@Param("status") String status);
}
