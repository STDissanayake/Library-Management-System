package com.library.library_management.repository;

import com.library.library_management.model.Borrow;
import com.library.library_management.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    // Find all borrows
    List<Borrow> findAll();

    // Find borrows by member
    @Query("SELECT b FROM Borrow b WHERE b.member.id = :memberId ORDER BY b.borrowDate DESC")
    List<Borrow> findBorrowsByMember(Long memberId);

    // Find active borrows
    @Query("SELECT b FROM Borrow b WHERE b.status = 'BORROWED' AND b.returnDate IS NULL ORDER BY b.borrowDate DESC")
    List<Borrow> findActiveBorrows();

    // Find overdue borrows
    @Query("SELECT b FROM Borrow b WHERE b.returnDate IS NULL AND (b.status = 'OVERDUE' OR b.dueDate < CURRENT_DATE) ORDER BY b.dueDate DESC")
    List<Borrow> findOverdueBorrows();

    // Find borrows by book
    @Query("SELECT b FROM Borrow b WHERE b.book.id = :bookId ORDER BY b.borrowDate DESC")
    List<Borrow> findBorrowsByBook(Long bookId);

    // Find borrows by status
    List<Borrow> findByStatus(String status);

    // Find borrows by date range
    @Query("SELECT b FROM Borrow b WHERE b.borrowDate BETWEEN :startDate AND :endDate ORDER BY b.borrowDate DESC")
    List<Borrow> findBorrowsByDateRange(LocalDate startDate, LocalDate endDate);

    // Find borrows by book ID (alias for findBorrowsByBook)
    List<Borrow> findByBookId(Long bookId);

    // Count active borrows for member
    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.member.id = :memberId AND b.status = 'BORROWED' AND b.returnDate IS NULL")
    Long countActiveBorrowsByMember(Long memberId);

    // Check if member has active borrows
    @Query("SELECT COUNT(b) > 0 FROM Borrow b WHERE b.member.id = :memberId AND b.status = 'BORROWED' AND b.returnDate IS NULL")
    boolean hasActiveBorrows(Long memberId);

    // Check if book is currently borrowed
    @Query("SELECT COUNT(b) > 0 FROM Borrow b WHERE b.book.id = :bookId AND b.status = 'BORROWED' AND b.returnDate IS NULL")
    boolean isBookCurrentlyBorrowed(Long bookId);

    // Get borrow history for member
    @Query("SELECT b FROM Borrow b WHERE b.member.id = :memberId ORDER BY b.borrowDate DESC")
    List<Borrow> getMemberBorrowHistory(Long memberId);

    // Count borrowable books by member
    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.member.id = :memberId AND b.status = 'BORROWED' AND b.returnDate IS NULL")
    Long countBorrowableBooksByMember(Long memberId);
}
