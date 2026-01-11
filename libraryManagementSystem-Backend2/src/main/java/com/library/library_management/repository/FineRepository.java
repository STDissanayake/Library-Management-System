package com.library.library_management.repository;

import com.library.library_management.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    // Find all fines
    List<Fine> findAll();

    @Query("SELECT f FROM Fine f JOIN FETCH f.borrow b JOIN FETCH b.book bk JOIN FETCH bk.author JOIN FETCH bk.publisher LEFT JOIN FETCH b.member JOIN FETCH f.member")
    List<Fine> findAllWithDetails();

    // Find fines by member
    List<Fine> findByMemberId(Long memberId);

    @Query("SELECT f FROM Fine f JOIN FETCH f.borrow b JOIN FETCH b.book bk JOIN FETCH bk.author JOIN FETCH bk.publisher LEFT JOIN FETCH b.member JOIN FETCH f.member WHERE f.member.id = :memberId")
    List<Fine> findByMemberIdWithDetails(Long memberId);

    // Find fines by status
    List<Fine> findByStatus(String status);

    @Query("SELECT f FROM Fine f JOIN FETCH f.borrow b JOIN FETCH b.book bk JOIN FETCH bk.author JOIN FETCH bk.publisher LEFT JOIN FETCH b.member JOIN FETCH f.member WHERE f.status = :status")
    List<Fine> findByStatusWithDetails(String status);

    // Find fines by borrow
    List<Fine> findByBorrowId(Long borrowId);

    @Query("SELECT f FROM Fine f JOIN FETCH f.borrow b JOIN FETCH b.book bk JOIN FETCH bk.author JOIN FETCH bk.publisher LEFT JOIN FETCH b.member JOIN FETCH f.member WHERE b.id = :borrowId")
    List<Fine> findByBorrowIdWithDetails(Long borrowId);
}
